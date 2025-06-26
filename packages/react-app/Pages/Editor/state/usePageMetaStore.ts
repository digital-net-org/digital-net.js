import React from 'react';
import { type StoredPatchOperation, type PageMeta } from '@digital-net/core';
import { useIDbStore } from '../../../Storage';

export function usePageMetaStore(pageId: string | undefined, metas: Array<PageMeta>) {
    const { getAll, ...store } = useIDbStore<StoredPatchOperation<PageMeta>>('patch:pages-metas');
    const [state, setState] = React.useState<Array<StoredPatchOperation<PageMeta>>>([]);

    const getPageMetas = React.useCallback(
        async (id: string) => (await getAll(x => x.value?.pageId === id)) ?? [],
        [getAll]
    );

    const clearStore = React.useCallback(
        async (id: string | undefined) => (id ? (await getPageMetas(id)).forEach(x => store.delete(x.id)) : void 0),
        [getPageMetas, store]
    );

    React.useEffect(() => {
        (async () => setState(pageId ? await getPageMetas(pageId) : []))();
    }, [getPageMetas, pageId]);

    const remove = React.useCallback(
        async ({ id }: PageMeta) => {
            const current = await store.get(id);
            if (!current) {
                setState(prev => prev.filter(x => x.id !== id));
                return await store.delete(id);
            }
            const patch = {
                id,
                op: 'remove',
                path: `/metas/${metas.findIndex(x => x.id === id)}`,
                value: current.value,
            } as const;
            setState(prev => prev.map(x => (x.id === id ? patch : x)));
            await store.save(id, patch);
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
            setState(prev => [...prev, patch]);
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
            setState(prev =>
                !prev.find(x => x.id === payload.id)
                    ? [...prev, patch]
                    : prev.map(x => (x.id === payload.id ? patch : x))
            );
            await store.save(payload.id, patch);
        },
        [metas, store]
    );

    return { state, add, remove, update, getPageMetas, clearStore };
}
