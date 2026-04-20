import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { JsonPatchOp, PageDto } from '@digital-net-org/digital-api-sdk';
import {
    DnEntityView,
    EntityFormProvider,
    type DnEntityViewTab,
    type EntityFormBinding,
    useEntityDraft,
    useEntityFormState,
    useEntityGet,
    useEntitySchema,
} from '../../entity';
import { useRouterBlocker } from '../../router';
import { DnDialog, DnLoadingView } from '../../ui';
import { useDnApi } from '../../api';
import { useDnToast } from '../../app';
import { PageEditTabGeneral } from './PageEditTabGeneral';
import { PageEditTabJsonLd } from './PageEditTabJsonLd';
import { PageEditTabOpenGraph } from './PageEditTabOpenGraph';
import { PageEditTabSheets } from './PageEditTabSheets';

export function PageEditView() {
    const { id } = useParams<{ id: string }>();
    const isNew = !id;
    const api = useDnApi();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useDnToast();
    const { data: page, isLoading, isFetching } = useEntityGet<PageDto>('cms/pages/:id', id);

    const edit = useEntityDraft<PageDto>('pages', id, page, { enabled: !isNew });
    const create = useEntityFormState<PageDto>();
    const { schemas } = useEntitySchema('page');

    const blocker = useRouterBlocker({ when: isNew && create.isDirty });
    const [isSaving, setIsSaving] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [errors, setErrors] = React.useState<ReadonlySet<string>>(new Set());
    const inputsDisabled = isSaving || isDeleting || isFetching;

    const rawSetField = isNew ? create.setField : edit.setField;
    const setField = React.useCallback(
        (path: string, value: unknown) => {
            rawSetField(path, value);
            if (errors.size === 0) return;
            const accessor = path.startsWith('/') ? path.slice(1).split('/')[0] : path;
            if (!errors.has(accessor)) return;
            setErrors(prev => {
                const next = new Set(prev);
                next.delete(accessor);
                return next;
            });
        },
        [errors, rawSetField]
    );

    const binding: EntityFormBinding<PageDto> = isNew
        ? { values: create.values, setField, isDirty: create.isDirty, errors, disabled: inputsDisabled }
        : { values: edit.values, setField, isDirty: edit.isDirty, errors, disabled: inputsDisabled };

    const handleSave = React.useCallback(async () => {
        if (isSaving) return;
        const values = (isNew ? create.values : edit.values) as Record<string, unknown>;
        const missing = new Set<string>();
        for (const s of schemas) {
            if (!s.isRequired || s.isReadOnly || s.isIdentity) continue;
            const accessor = `${s.name.charAt(0).toLowerCase()}${s.name.slice(1)}`;
            const v = values[accessor];
            const isEmpty = v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
            if (isEmpty) missing.add(accessor);
        }
        if (missing.size > 0) {
            setErrors(missing);
            showToast(
                missing.size > 1
                    ? 'Certains champs requis sont vides'
                    : 'Un champ requis est vide',
                'error'
            );
            return;
        }
        setErrors(new Set());
        setIsSaving(true);
        try {
            if (isNew) {
                const createResult = await api.catalog.page.create({
                    path: String(create.values.path ?? ''),
                });
                if (createResult.hasError || !createResult.value) {
                    showToast('Erreur lors de la création de la page', 'error');
                    return;
                }
                const newId = createResult.value;
                const extraOps: JsonPatchOp[] = Object.entries(create.values)
                    .filter(([key]) => key !== 'path')
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => ({ op: 'replace', path: `/${key}`, value }));
                if (extraOps.length > 0) {
                    const patchResult = await api.catalog.page.update(newId, extraOps);
                    if (patchResult.hasError) {
                        showToast('Page créée mais certains champs n\u2019ont pas été enregistrés', 'error');
                        navigate(`/content-manager/pages/${newId}`);
                        return;
                    }
                }
                await queryClient.invalidateQueries({ queryKey: ['dn-entity-list', 'cms/pages'] });
                showToast('Page créée', 'info');
                navigate(`/content-manager/pages/${newId}`);
                return;
            }
            const updateResult = await api.catalog.page.update(id!, edit.ops);
            if (updateResult.hasError) {
                showToast('Erreur lors de la sauvegarde', 'error');
                return;
            }
            await edit.commit();
            await queryClient.invalidateQueries({ queryKey: ['entity-get', 'cms/pages/:id', id] });
            await queryClient.invalidateQueries({ queryKey: ['dn-entity-list', 'cms/pages'] });
            showToast('Modifications enregistrées', 'info');
        } finally {
            setIsSaving(false);
        }
    }, [api, create.values, edit, id, isNew, isSaving, navigate, queryClient, schemas, showToast]);

    const handleDelete = React.useCallback(async () => {
        setDeleteDialogOpen(false);
        if (!id) return;
        setIsDeleting(true);
        try {
            const result = await api.catalog.page.delete(id);
            if (result.hasError) {
                showToast('Erreur lors de la suppression', 'error');
                return;
            }
            await edit.discard();
            await queryClient.invalidateQueries({ queryKey: ['dn-entity-list', 'cms/pages'] });
            showToast('Page supprimée', 'info');
            navigate('/content-manager/pages');
        } finally {
            setIsDeleting(false);
        }
    }, [api, edit, id, navigate, queryClient, showToast]);

    if (isLoading) return <DnLoadingView />;

    const tabs: DnEntityViewTab[] = [
        { key: 'general', label: 'Général', content: <PageEditTabGeneral isNew={isNew} /> },
        { key: 'jsonld', label: 'JSON-LD', content: <PageEditTabJsonLd /> },
        { key: 'opengraph', label: 'OpenGraph', content: <PageEditTabOpenGraph /> },
        { key: 'sheets', label: 'Sheets', content: <PageEditTabSheets /> },
    ];

    return (
        <EntityFormProvider binding={binding}>
            <DnEntityView
                title={isNew ? 'Créer une nouvelle page' : `Édition : ${page!.path}`}
                tabs={tabs}
                isNew={isNew}
                isSaving={isSaving || isDeleting}
                isDirty={binding.isDirty}
                hasConflict={!isNew && edit.hasConflict}
                baselineUpdatedAt={edit.baselineUpdatedAt}
                apiUpdatedAt={edit.apiUpdatedAt}
                onSave={handleSave}
                onDelete={() => setDeleteDialogOpen(true)}
                onReload={edit.discard}
            />
            <DnDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                confirmLabel="Supprimer"
                title="Supprimer la page"
            >
                Cette action est définitive. Continuer ?
            </DnDialog>
            <DnDialog
                open={blocker.isBlocked}
                onClose={blocker.cancel}
                onConfirm={blocker.confirm}
                confirmLabel="Quitter sans sauvegarder"
                title="Modifications non sauvegardées"
            >
                Si vous quittez cette page, les données saisies seront perdues. Continuer ?
            </DnDialog>
        </EntityFormProvider>
    );
}
