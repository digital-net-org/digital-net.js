import React from 'react';
import { type Entity } from '@digital-net/core';
import { DigitalIdbContext } from './DigitalIdbContext';
import { IDbStore } from './IDbStore';
import { type DigitalIdbStore } from './DigitalIdbProvider';

/**
 * IndexedDb store accessor hook
 * @param store - store name (table)
 * @returns the store accessor methods and context
 *  - get: retrieve an entity from the store
 *  - save: save an entity to the store
 *  - delete: delete an entity from the store
 */
export function useIDbStore<T extends { id: Entity['id'] }>(store: DigitalIdbStore) {
    const { database, outdatedQueries, addOutdatedQuery, deleteOutdatedQuery } = React.useContext(DigitalIdbContext);

    const getAll = React.useCallback(
        async (cb?: (entity: T) => boolean) => {
            if (!database) {
                return;
            }
            const result = (await IDbStore.getAll<T>(database, store)) ?? [];
            return cb ? result.filter(cb) : result;
        },
        [database, store]
    );

    const get = React.useCallback(
        async (id: T['id'] | undefined) => {
            if (!database || !id) {
                return;
            }
            const result = await IDbStore.get<T>(database, store, id);
            deleteOutdatedQuery(store, String(id));
            return result;
        },
        [database, deleteOutdatedQuery, store]
    );

    const save = React.useCallback(
        async (id: T['id'] | undefined, payload: Partial<T> | ((prev: Partial<T>) => Partial<T>)) => {
            if (!database || !id) {
                return;
            }
            const current = (await IDbStore.get<T>(database, store, id)) ?? ({ id } as Partial<T>);
            await IDbStore.save<T>(database, store, typeof payload === 'function' ? payload(current) : payload);
            addOutdatedQuery(store, String(id));
        },
        [addOutdatedQuery, database, store]
    );

    const _delete = React.useCallback(
        async (id: T['id'] | undefined) => {
            if (!database || !id) {
                return;
            }
            await IDbStore.delete(database, store, id);
            addOutdatedQuery(store, String(id));
        },
        [addOutdatedQuery, database, store]
    );

    return {
        get,
        getAll,
        save,
        delete: _delete,
        outdatedQueries,
    };
}
