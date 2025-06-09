import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StringIdentity, type Page, type PageLight } from '@digital-net/core';
import { useCreate, useDelete, useGet, useGetById, usePatch } from '@digital-net/react-digital-client';
import { EditorHelper } from '../editor/EditorHelper';
import { EditorApiHelper } from './EditorApiHelper';

export function useEditorCrud(config: {
    id: string | undefined;
    stored: Page | undefined;
    onDelete: () => Promise<void> | void;
    onPatch: () => Promise<void> | void;
}) {
    const navigate = useNavigate();

    const { entities, ...getAll } = useGet<PageLight>(EditorApiHelper.apiUrl);
    const { entity, ...getByIdApi } = useGetById<Page>(EditorApiHelper.apiUrl, config.id);

    const reload = React.useCallback(
        (type: 'all' | 'current') => {
            if (type === 'all') {
                EditorApiHelper.invalidateGetAll();
            } else if (type === 'current') {
                EditorApiHelper.invalidateGetById(String(config.id));
            }
        },
        [config.id]
    );

    const { isCreating, ...createApi } = useCreate<Page>(EditorApiHelper.apiUrl, {
        onSuccess: async () => reload('current'),
    });

    const { isDeleting, ...deleteApi } = useDelete(EditorApiHelper.apiUrl, {
        onSuccess: async () => {
            await config.onDelete();
            reload('all');
            reload('current');
            navigate(ROUTER_EDITOR);
        },
    });

    const { isPatching, ...patchApi } = usePatch<Page>(EditorApiHelper.apiUrl, {
        onSuccess: async () => {
            await config.onPatch();
            reload('all');
            reload('current');
        },
    });

    const isLoading = React.useMemo(
        () => getAll.isQuerying || getByIdApi.isQuerying || isCreating || isPatching || isDeleting,
        [getAll.isQuerying, getByIdApi.isQuerying, isCreating, isPatching, isDeleting]
    );

    const handleCreate = React.useCallback(async () => {
        if (!isLoading) {
            const title = StringIdentity.generate();
            createApi.create({
                title,
                data: JSON.stringify(EditorHelper.defaultData),
                path: '/' + title,
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

    return { handleCreate, handleDelete, handlePatch, isLoading, reload, page: entity, pageList: entities };
}
