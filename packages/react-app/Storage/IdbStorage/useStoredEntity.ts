import React from 'react';
import type { Entity } from '@digital-net/core';
import { useIDbStore } from './useIDbStore';

/**
 * IndexedDb stored entity accessor hook
 * @param store - store name (table)
 * @param id - entity id
 * @returns the stored entity and context
 *  - storedEntity: the stored entity
 *  - storedExists: indicates if the entity exists in the store
 *  - saveEntity: save the entity to the store
 *  - deleteEntity: delete the entity from the store
 *  - isLoading: indicates if the store is currently loading
 */
export function useStoredEntity<T extends Entity>(store: string, id: string | number | undefined) {
    const { isLoading, get, save, delete: _delete, outdatedQueries } = useIDbStore<T>(store);

    const [storedExists, setStoredExists] = React.useState(false);
    const [storedEntity, setStoredEntity] = React.useState<T | undefined>(undefined);

    const deleteEntity = React.useCallback(async () => await _delete(id), [_delete, id]);
    const saveEntity = React.useCallback(async (payload: Partial<T>) => await save(payload), [save]);

    const getStoredEntity = React.useCallback(
        async (id: string | number) => {
            const entity = await get(id);
            setStoredEntity(entity);
            setStoredExists(!!entity);
        },
        [get]
    );

    React.useEffect(() => {
        (async () => {
            if (!id) {
                return;
            }
            await getStoredEntity(id);
        })();
    }, [id, getStoredEntity]);

    React.useEffect(() => {
        (async () => {
            if (!outdatedQueries.includes(`${store}:${id}`)) {
                return;
            }
            await getStoredEntity(id!);
        })();
    }, [id, outdatedQueries, store, getStoredEntity]);

    return {
        storedEntity,
        storedExists,
        isLoading,
        saveEntity,
        deleteEntity,
    };
}
