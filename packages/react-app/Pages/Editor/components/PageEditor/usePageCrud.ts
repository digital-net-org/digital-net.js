import React from 'react';
import { StringIdentity, type Page, type PageLight } from '@digital-net/core';
import { useCreate, useDelete, useGet, useGetById, usePatch } from '@digital-net/react-digital-client';
import { usePageUrlState } from './usePageUrlState';
import { PuckEditorHelper } from './PuckEditor';
import { PageEditorHelper } from './PageEditorHelper';

export function usePageCrud(config: {
    stored: Page | undefined;
    onDelete: () => Promise<void> | void;
    onPatch: () => Promise<void> | void;
}) {
    const { currentPage, reset } = usePageUrlState();
    const { entities, ...getAll } = useGet<PageLight>(PageEditorHelper.apiUrl);
    const { entity, ...getByIdApi } = useGetById<Page>(PageEditorHelper.apiUrl, currentPage);

    const { isCreating, ...createApi } = useCreate<Page>(PageEditorHelper.apiUrl, {
        onSuccess: async () => {
            PageEditorHelper.invalidateGetAll();
        },
    });

    const { isDeleting, ...deleteApi } = useDelete(PageEditorHelper.apiUrl, {
        onSuccess: async () => {
            reset();
            await config.onDelete();
            PageEditorHelper.invalidateGetById(currentPage);
            PageEditorHelper.invalidateGetAll();
        },
    });

    const { isPatching, ...patchApi } = usePatch<Page>(PageEditorHelper.apiUrl, {
        onSuccess: async () => {
            await config.onPatch();
            PageEditorHelper.invalidateGetById(currentPage);
            PageEditorHelper.invalidateGetAll();
        },
    });

    const isLoading = React.useMemo(
        () => getAll.isQuerying || getByIdApi.isQuerying || isCreating || isPatching || isDeleting,
        [getAll.isQuerying, getByIdApi.isQuerying, isCreating, isPatching, isDeleting]
    );

    const handleCreate = React.useCallback(async () => {
        if (!isLoading) {
            createApi.create({
                data: JSON.stringify(PuckEditorHelper.default),
                path: '/' + StringIdentity.generate(),
            });
        }
    }, [createApi, isLoading]);

    const handleDelete = React.useCallback(async () => {
        if (entity && !isLoading) {
            deleteApi.delete(entity.id);
        }
    }, [entity, isLoading, deleteApi]);

    const handlePatch = React.useCallback(async () => {
        if (!entity || !config.stored || isLoading) {
            return;
        }
        patchApi.patch(entity.id, { ...config.stored, data: JSON.stringify(config.stored.data) });
    }, [entity, isLoading, config.stored, patchApi]);

    return { handleCreate, handleDelete, handlePatch, isLoading, frame: entity, frameList: entities };
}
