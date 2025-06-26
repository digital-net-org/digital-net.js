import type { Entity } from '@digital-net/core';

interface IDbEntity {
    id: Entity['id'];
}

/**
 * Indexed database store accessor utilities
 */
export class IDbStore {
    private static validateStore(db: IDBDatabase, store: string): void {
        if (![...db.objectStoreNames].includes(store)) {
            throw new Error(`IDbStore: error getting data: store "${store}" does not exist`);
        }
    }

    private static validatePayload<T extends IDbEntity>(data: Partial<T>): Partial<T> {
        if (!data.id) {
            throw new Error('IDbStore: error saving data: id is required');
        }
        return { ...data, updatedAt: new Date(Date.now()), id: String(data.id) };
    }

    private static getStore(db: IDBDatabase, store: string, mode?: IDBTransactionMode): IDBObjectStore {
        return db.transaction(store, mode ?? 'readwrite').objectStore(store);
    }

    /**
     * Retrieve all entities from the store
     * @param db - database instance
     * @param store - store name
     */
    public static async getAll<T extends IDbEntity>(db: IDBDatabase, store: string): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            try {
                this.validateStore(db, store);
                const request = this.getStore(db, store, 'readonly').getAll();
                request.onsuccess = () => resolve((request.result ?? []) as T[]);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Retrieve an entity from the store
     * @param db - database instance
     * @param store - store name
     * @param id - entity id
     */
    public static async get<T extends IDbEntity>(db: IDBDatabase, store: string, id: string): Promise<T | undefined> {
        return new Promise<T | undefined>((resolve, reject) => {
            try {
                this.validateStore(db, store);
                const request = this.getStore(db, store, 'readonly').get(String(id));
                request.onsuccess = () => resolve(request.result as T);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Save Entity to the store
     * @param db - database instance
     * @param store - store name
     * @param data - entity data
     */
    public static async save<T extends IDbEntity>(db: IDBDatabase, store: string, data: Partial<T>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.validateStore(db, store);
                const payload = this.validatePayload(data);
                const storeObject = this.getStore(db, store);
                const result = storeObject.get(String(payload.id));
                result.onsuccess = () => {
                    if (result?.result !== undefined) {
                        storeObject.put({ ...(result?.result ?? {}), ...payload });
                    } else {
                        storeObject.add(payload);
                    }
                    window?.dispatchEvent(new Event(`IDB_SET_${store}_${payload.id}`));
                    window?.dispatchEvent(new Event(`IDB_SET_${store}_ANY`));
                    resolve();
                };
                result.onerror = () => console.error(result.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Delete Entity from the store
     * @param db - database instance
     * @param store - store name
     * @param id - entity id
     */
    public static async delete(db: IDBDatabase, store: string, id: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.validateStore(db, store);
                this.getStore(db, store, 'readwrite').delete(String(id));
                window?.dispatchEvent(new Event(`IDB_REMOVE_${store}_${id}`));
                window?.dispatchEvent(new Event(`IDB_REMOVE_${store}_ANY`));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Register an event listener for changes in the store
     * @param store - store name
     * @param id - entity id, if null, the listener will be registered for all entities in the store
     * @param callback - callback to execute when the entity is set
     */
    public static onSet(store: string, id: string | null, callback: () => void) {
        window?.addEventListener?.(`IDB_SET_${store}_${id ?? 'ANY'}`, () => callback());
    }

    /**
     * Register an event listener for changes in the store
     * @param store - store name
     * @param id - entity id, if null, the listener will be registered for all entities in the store
     * @param callback - callback to execute when the entity is removed
     */
    public static onRemove(store: string, id: string | null, callback: () => void) {
        window?.addEventListener?.(`IDB_REMOVE_${store}_${id ?? 'ANY'}`, () => callback());
    }

    /**
     * Clear event listeners for the store
     * @param store - store name
     * @param id - entity id, if null, the listener will be removed for all entities in the store
     * @param callback - callback to remove
     */
    public static clearListeners(store: string, id: string | null, callback: () => void) {
        window?.removeEventListener?.(`IDB_SET_${store}_${id ?? 'ANY'}`, callback);
        window?.removeEventListener?.(`IDB_REMOVE_${store}_${id ?? 'ANY'}`, callback);
    }
}
