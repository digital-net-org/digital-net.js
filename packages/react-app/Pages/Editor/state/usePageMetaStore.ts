import React from 'react';
import { type StoredPatchOperation, type PageMeta } from '@digital-net/core';
import { useIDbStore } from '../../../Storage';
import { EditorApiHelper } from './EditorApiHelper';

export function usePageMetaStore(metas: Array<PageMeta>) {
    const { getAll, ...store } = useIDbStore<StoredPatchOperation<PageMeta>>('patch:pages-metas');

    const getPageMetas = React.useCallback(
        async (id: string) => (await getAll(x => x.value?.pageId === id)) ?? [],
        [getAll]
    );

    const clearStore = React.useCallback(
        async (id: string | undefined) => {
            if (!id) return;

            (await getPageMetas(id)).forEach(x => store.delete(x.id));
            EditorApiHelper.invalidateMetas(id);
        },
        [getPageMetas, store]
    );

    const remove = React.useCallback(
        async ({ id }: PageMeta) => {
            const stored = await store.get(id);
            const index = metas.findIndex(x => x.id === id);
            if (stored && index === -1) {
                return await store.delete(id);
            }
            if (index > -1) {
                const patch = {
                    id,
                    op: 'remove',
                    path: `/metas/${index}`,
                    value: metas[index],
                } as const;
                await store.save(id, patch);
            }
        },
        [metas, store]
    );

    const add = React.useCallback(
        async (payload: PageMeta) => {
            const patch = {
                id: payload.id,
                op: 'add',
                path: '/metas/-',
                value: payload,
            } as const;
            await store.save(payload.id, patch);
        },
        [store]
    );

    const update = React.useCallback(
        async (payload: PageMeta) => {
            const current = await store.get(payload.id);
            const patch = current
                ? { ...current, value: { ...current.value, ...payload } }
                : ({
                      id: payload.id,
                      op: 'replace',
                      path: `/metas/${metas.findIndex(x => x.id === payload.id)}`,
                      value: payload,
                  } as const);
            await store.save(payload.id, patch);
        },
        [metas, store]
    );

    return { add, remove, update, getPageMetas, clearStore };
}
