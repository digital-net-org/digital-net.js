import React from 'react';
import { StringIdentity, type Page, type PageLight } from '@digital-net/core';
import { useCreate, useDelete, useGet, useGetById, usePatch } from '@digital-net/react-digital-client';
import { useFrameUrlState } from './useFrameUrlState';
import { PuckEditorHelper } from './PuckEditor';
import { FrameEditorHelper } from './FrameEditorHelper';

export function useFrameCrud(config: {
    stored: Page | undefined;
    onDelete: () => Promise<void> | void;
    onPatch: () => Promise<void> | void;
}) {
    const { currentFrame, reset } = useFrameUrlState();
    const { entities, ...getAll } = useGet<PageLight>(FrameEditorHelper.apiUrl);
    const { entity, ...getByIdApi } = useGetById<Page>(FrameEditorHelper.apiUrl, currentFrame);

    const { isCreating, ...createApi } = useCreate<Page>(FrameEditorHelper.apiUrl, {
        onSuccess: async () => {
            FrameEditorHelper.invalidateGetAll();
        },
    });

    const { isDeleting, ...deleteApi } = useDelete(FrameEditorHelper.apiUrl, {
        onSuccess: async () => {
            reset();
            await config.onDelete();
            FrameEditorHelper.invalidateGetById(currentFrame);
            FrameEditorHelper.invalidateGetAll();
        },
    });

    const { isPatching, ...patchApi } = usePatch<Page>(FrameEditorHelper.apiUrl, {
        onSuccess: async () => {
            await config.onPatch();
            FrameEditorHelper.invalidateGetById(currentFrame);
            FrameEditorHelper.invalidateGetAll();
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
