import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Entity, JsonPatchOp, Result, SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { DnEntityView, type DnEntityViewTab } from '../DnEntityView';
import { DnEntityFormProvider, type DnEntityFormBinding } from '../DnEntityFormProvider';
import { useEntityDraft } from '../useEntityDraft';
import { useEntityFormState } from '../useEntityFormState';
import { useEntitySchema } from '../useEntitySchema';
import { type DnEntityName } from '../DnEntitySchemaProvider';
import { useRouterBlocker } from '../../router';
import { DnDialog, DnLoadingView } from '../../ui';
import { useDnToast } from '../../app';
import { type DnDraftStoreName } from '../../constants';
import { type EntityIdentifier } from '../types';
import {
    buildCreateErrorToast,
    buildCreateTitle,
    buildCreatedToast,
    buildDeleteTitle,
    buildDeletedToast,
} from './identifier';

export interface DnEntityEditViewProps<T extends Entity> {
    entityName: DnEntityName;
    identifier: EntityIdentifier;
    identifierAccessor: keyof T;
    draftStoreName: DnDraftStoreName;
    tabs: DnEntityViewTab[];
    description?: string;
    onGet: (_id: string) => Promise<Result<T>>;
    onCreate: (_values: Partial<T>) => Promise<Result<string>>;
    onUpdate: (_id: string, _ops: JsonPatchOp[]) => Promise<Result<unknown>>;
    onDelete: (_id: string) => Promise<Result<unknown>>;
    redirectPath: string;
    listPath: string;
    validate?: (_values: Partial<T>, _schemas: SchemaProperty[]) => Set<string>;
}

function defaultValidate<T>(values: Partial<T>, schemas: SchemaProperty[]): Set<string> {
    const missing = new Set<string>();
    const record = values as Record<string, unknown>;
    for (const s of schemas) {
        if (!s.isRequired || s.isReadOnly || s.isIdentity) continue;
        const accessor = `${s.name.charAt(0).toLowerCase()}${s.name.slice(1)}`;
        const v = record[accessor];
        const isEmpty = v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
        if (isEmpty) missing.add(accessor);
    }
    return missing;
}

export function DnEntityEditView<T extends Entity>({
    entityName,
    identifier,
    identifierAccessor,
    draftStoreName,
    tabs,
    description,
    onGet,
    onCreate,
    onUpdate,
    onDelete,
    redirectPath,
    listPath,
    validate,
}: DnEntityEditViewProps<T>) {
    const { id } = useParams<{ id: string }>();
    const isNew = !id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showToast } = useDnToast();

    const {
        data: entity,
        isLoading,
        isFetching,
    } = useQuery<T | undefined>({
        queryKey: ['entity-get', entityName, id],
        queryFn: async () => {
            const result = await onGet(id!);
            if (result.hasError) {
                throw new Error(result.errors?.[0]?.message ?? `Failed to fetch ${entityName}`);
            }
            return result.value;
        },
        enabled: !isNew,
        retry: false,
    });

    const edit = useEntityDraft<T>(draftStoreName, id, entity, { enabled: !isNew });
    const create = useEntityFormState<T>();
    const { schemas } = useEntitySchema(entityName);

    const [isSaving, setIsSaving] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [errors, setErrors] = React.useState<ReadonlySet<string>>(new Set());

    const blocker = useRouterBlocker({ when: isNew && create.isDirty && !isSaving });

    const inputsDisabled = isSaving || isDeleting || (!isNew && isFetching);

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

    const binding: DnEntityFormBinding<T> = isNew
        ? { values: create.values, setField, isDirty: create.isDirty, errors, disabled: inputsDisabled }
        : { values: edit.values, setField, isDirty: edit.isDirty, errors, disabled: inputsDisabled };

    const invalidateList = React.useCallback(
        () => queryClient.invalidateQueries({ queryKey: ['dn-entity-list', listPath] }),
        [queryClient, listPath]
    );
    const invalidateGet = React.useCallback(
        () => queryClient.invalidateQueries({ queryKey: ['entity-get', entityName, id] }),
        [queryClient, entityName, id]
    );

    const handleSave = React.useCallback(async () => {
        if (isSaving) return;
        const values = (isNew ? create.values : edit.values) as Partial<T>;
        const missing = (validate ?? defaultValidate)(values, schemas);
        if (missing.size > 0) {
            setErrors(missing);
            showToast(missing.size > 1 ? 'Certains champs requis sont vides' : 'Un champ requis est vide', 'error');
            return;
        }
        setErrors(new Set());
        setIsSaving(true);
        try {
            if (isNew) {
                const created = await onCreate(values);
                if (created.hasError || !created.value) {
                    showToast(buildCreateErrorToast(identifier), 'error');
                    return;
                }
                await invalidateList();
                showToast(buildCreatedToast(identifier), 'info');
                navigate(`${redirectPath}/${created.value}`);
                return;
            }
            const updated = await onUpdate(id!, edit.ops);
            if (updated.hasError) {
                showToast('Erreur lors de la sauvegarde', 'error');
                return;
            }
            await edit.commit();
            await invalidateGet();
            await invalidateList();
            showToast('Modifications enregistrées', 'info');
        } finally {
            setIsSaving(false);
        }
    }, [
        create.values,
        edit,
        id,
        identifier,
        invalidateGet,
        invalidateList,
        isNew,
        isSaving,
        navigate,
        onCreate,
        onUpdate,
        redirectPath,
        schemas,
        showToast,
        validate,
    ]);

    const handleDelete = React.useCallback(async () => {
        setDeleteDialogOpen(false);
        if (!id) return;
        setIsDeleting(true);
        try {
            const result = await onDelete(id);
            if (result.hasError) {
                showToast('Erreur lors de la suppression', 'error');
                return;
            }
            await edit.discard();
            await invalidateList();
            showToast(buildDeletedToast(identifier), 'info');
            navigate(redirectPath);
        } finally {
            setIsDeleting(false);
        }
    }, [edit, id, identifier, invalidateList, navigate, onDelete, redirectPath, showToast]);

    if (!isNew && isLoading) return <DnLoadingView />;

    const title = isNew
        ? buildCreateTitle(identifier)
        : `Édition : ${String((entity as Partial<T> | undefined)?.[identifierAccessor] ?? '')}`;

    return (
        <DnEntityFormProvider binding={binding}>
            <DnEntityView
                title={title}
                description={description}
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
                title={buildDeleteTitle(identifier)}
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
        </DnEntityFormProvider>
    );
}
