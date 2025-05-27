import React from 'react';
import type { Entity } from '@digital-net/dto';
import { DigitalIdbContext, type DigitalIdbContextState } from './DigitalIdbContext';
import { IDbStore } from './IDbStore';

/**
 * IndexedDb store accessor hook
 * @param store - store name (table)
 * @returns the store accessor methods and context
 *  - get: retrieve an entity from the store
 *  - save: save an entity to the store
 *  - delete: delete an entity from the store
 *  - isLoading: indicates if the store is currently loading
 */
export function useIDbStore<T extends Entity>(store: string) {
    const { database, outdatedQueries, addOutdatedQuery, deleteOutdatedQuery, ...context }: DigitalIdbContextState =
        React.useContext(DigitalIdbContext);
    const [isLoading, setIsLoading] = React.useState(false);

    const get = React.useCallback(
        async (id: string | number | undefined) => {
            if (!database || !id) {
                return;
            }
            setIsLoading(true);
            const result = await IDbStore.get<T>(database, store, id);
            setIsLoading(false);
            deleteOutdatedQuery(store, String(id));
            return result;
        },
        [database, deleteOutdatedQuery, store]
    );

    const save = React.useCallback(
        async (payload: Partial<T>) => {
            if (!database || !payload.id) {
                return;
            }
            setIsLoading(true);
            await IDbStore.save<T>(database, store, payload);
            setIsLoading(false);
            addOutdatedQuery(store, String(payload.id));
        },
        [addOutdatedQuery, database, store]
    );

    const _delete = React.useCallback(
        async (id: string | number | undefined) => {
            if (!database || !id) {
                return;
            }
            setIsLoading(true);
            await IDbStore.delete<T>(database, store, id);
            setIsLoading(false);
            addOutdatedQuery(store, String(id));
        },
        [addOutdatedQuery, database, store]
    );

    return {
        get,
        save,
        delete: _delete,
        isLoading: isLoading || context.isLoading,
        outdatedQueries,
    };
}
