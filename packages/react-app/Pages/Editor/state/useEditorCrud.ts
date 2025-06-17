import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Entity, type Page, type PageLight, StringIdentity, ObjectMatcher } from '@digital-net/core';
import { useCreate, useDelete, useGet, useGetById, usePatch } from '@digital-net/react-digital-client';
import { EditorHelper } from '../editor/EditorHelper';
import { EditorApiHelper } from './EditorApiHelper';

export function useEditorCrud(config: {
    id: string | undefined;
    stored: Page | undefined;
    onDelete: () => Promise<void> | void;
    onPatch: () => Promise<void> | void;
    onCreate: (id: Entity['id']) => Promise<void> | void;
}) {
    const navigate = useNavigate();

    const { entities, ...getAll } = useGet<PageLight>('page');
    const { entity, ...getByIdApi } = useGetById<Page>('page', config.id);

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

    const { isCreating, ...createApi } = useCreate<Page>('page', {
        onSuccess: async ({ value: id }) => {
            reload('all');
            if (id) {
                config.onCreate(id);
            }
        },
    });

    const { isDeleting, ...deleteApi } = useDelete('page', {
        onSuccess: async () => {
            await config.onDelete();
            reload('all');
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
                puckData: JSON.stringify(EditorHelper.defaultData),
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
        patchApi.patch(
            entity.id,
            Object.keys(config.stored ?? {}).reduce<Partial<Page>>((acc, key) => {
                if (key === 'puckData') {
                    acc[key] = config.stored?.puckData;
                } else if (
                    key !== 'id' &&
                    key !== 'createdAt' &&
                    key !== 'updatedAt' &&
                    !ObjectMatcher.deepEquality(config.stored?.[key], entity[key])
                ) {
                    acc[key] = config.stored?.[key];
                }
                return acc;
            }, {})
        );
    }, [entity, isLoading, config.stored, patchApi]);

    return { handleCreate, handleDelete, handlePatch, isLoading, reload, page: entity, pageList: entities };
}
