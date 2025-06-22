import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Page, type PageLight, ClientError, StringIdentity, ObjectMatcher } from '@digital-net/core';
import { useCreate, useDelete, useGet, useGetById, usePatch } from '@digital-net/react-digital-client';
import { useToaster } from '../../../Toaster';
import { EditorHelper } from '../editor/EditorHelper';
import { EditorApiHelper } from './EditorApiHelper';
import { usePageStore } from './usePageStore';
import { Localization } from '@digital-net/react-app';

export function useEditorCrud() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToaster();
    const { delete: localDelete, get: localGet } = usePageStore();

    const { entities, ...getAll } = useGet<PageLight>('page');
    const { entity, ...getByIdApi } = useGetById<Page>('page', id);

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
            reload('all');
            if (id) {
                navigate({ pathname: `${ROUTER_EDITOR}/${id}`, search: location.search });
            }
        },
    });

    const { isDeleting, ...deleteApi } = useDelete('page', {
        onSuccess: async () => {
            await localDelete(id);
            reload('all');
            navigate(ROUTER_EDITOR);
        },
    });

    const { isPatching, ...patchApi } = usePatch<Page>(EditorApiHelper.apiUrl, {
        onSuccess: async () => {
            await localDelete(id);
            reload('all');
            reload('current');
        },
        onError: error => {
            if (ClientError.isErrorOfType(error, 'Entity-validation-exception')) {
                toast(Localization.translate('page-editor:error.path-duplicate'), 'error');
            }
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
        const storedEntity = await localGet(id);
        if (!entity || !storedEntity || isLoading) {
            return;
        }
        const payload = Object.keys(storedEntity ?? {}).reduce<Partial<Page>>((acc, key) => {
            if (key === 'puckData') {
                acc[key] = storedEntity.puckData;
            } else if (
                key !== 'id' &&
                key !== 'createdAt' &&
                key !== 'updatedAt' &&
                !ObjectMatcher.deepEquality(storedEntity[key], entity[key])
            ) {
                acc[key] = storedEntity[key];
            }
            return acc;
        }, {});
        if (payload.path && !/^\/.*/.test(payload.path)) {
            payload.path = '/' + payload.path;
        }
        patchApi.patch(entity.id, payload);
    }, [localGet, id, entity, isLoading, patchApi]);

    return { handleCreate, handleDelete, handlePatch, isLoading, reload, page: entity, pageList: entities };
}
