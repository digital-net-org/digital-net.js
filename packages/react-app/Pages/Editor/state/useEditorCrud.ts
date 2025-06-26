import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    type Page,
    type PageLight,
    ClientError,
    type Result,
    type PageMeta,
    EntityHelper,
    type EntityRaw,
} from '@digital-net/core';
import { useCreate, useDelete, useDigitalQuery, useGet, useGetById, usePatch } from '@digital-net/react-digital-client';
import { useToaster } from '../../../Toaster';
import { Localization } from '../../../Localization';
import { EditorApiHelper } from './EditorApiHelper';
import { usePageStore } from './usePageStore';
import { usePageMetaStore } from './usePageMetaStore';

export function useEditorCrud(config: { onLoading: () => void }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToaster();
    const { delete: localDelete, get: localGet } = usePageStore();
    const { clearStore, getPageMetas } = usePageMetaStore(undefined, []);

    const { entities, ...getAll } = useGet<PageLight>('page');
    const { entity, ...getByIdApi } = useGetById<Page>('page', id);
    const { isLoading: isMetaLoading, data } = useDigitalQuery<Result<Array<EntityRaw>>>('page/:id/meta', {
        slugs: { id },
        enabled: Boolean(id),
    });
    const pageMetas = React.useMemo(() => (data?.value ?? []).map(EntityHelper.build<PageMeta>), [data]);

    const reload = React.useCallback(
        (type: 'all' | 'current') => {
            if (type === 'all') {
                EditorApiHelper.invalidateGetAll();
            } else if (type === 'current' && id) {
                EditorApiHelper.invalidateGetById(id);
            }
        },
        [id]
    );

    const { isCreating, ...createApi } = useCreate<Page>('page', {
        onSuccess: async ({ value: id }) => {
            config.onLoading();
            reload('all');
            if (id) {
                navigate({ pathname: `${ROUTER_EDITOR}/${id}`, search: location.search });
            }
        },
    });

    const { isDeleting, ...deleteApi } = useDelete('page', {
        onSuccess: async () => {
            await localDelete(id);
            await clearStore(id);
            reload('all');
            navigate(ROUTER_EDITOR);
        },
    });

    const { isPatching, ...patchApi } = usePatch<Page>(EditorApiHelper.apiUrl, {
        onSuccess: async () => {
            config.onLoading();
            await localDelete(id);
            await clearStore(id);
            reload('all');
            reload('current');
        },
        onError: error => {
            if (ClientError.isErrorOfType(error, 'Entity-validation-exception')) {
                if (error.errors[0].message === '/description: Maximum length exceeded.') {
                    toast(Localization.translate('page-editor:error.desc-max-length'), 'error');
                }
                if (error.errors[0].message === '/path: This value violates a unique constraint.') {
                    toast(Localization.translate('page-editor:error.path-duplicate'), 'error');
                }
            }
        },
    });

    const isLoading = React.useMemo(
        () => isMetaLoading || getAll.isQuerying || getByIdApi.isQuerying || isCreating || isPatching || isDeleting,
        [isMetaLoading, getAll.isQuerying, getByIdApi.isQuerying, isCreating, isPatching, isDeleting]
    );

    const handleCreate = React.useCallback(async () => {
        if (!isLoading) {
            createApi.create(EditorApiHelper.handleCreate());
        }
    }, [createApi, isLoading]);

    const handleDelete = React.useCallback(async () => {
        if (entity && !isLoading) {
            deleteApi.delete(entity.id);
        }
    }, [entity, isLoading, deleteApi]);

    const handlePatch = React.useCallback(async () => {
        if (entity && id && !isLoading) {
            const storedEntity = await localGet(id);
            const storedMetas = await getPageMetas(id);
            patchApi.patch(entity.id, EditorApiHelper.handlePagePatch(storedEntity, entity, storedMetas));
        }
    }, [localGet, id, entity, isLoading, getPageMetas, patchApi]);

    return { handleCreate, handleDelete, handlePatch, isLoading, reload, page: entity, pageList: entities, pageMetas };
}
