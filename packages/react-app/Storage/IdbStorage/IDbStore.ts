import { type Entity, DigitalEvent } from '@digital-net/core';

interface IDbEntity {
    id: Entity['id'];
}

interface IdbEventPayload {
    store: string;
    id: string;
}

/**
 * Indexed database store accessor utilities
 */
export class IDbStore {
    private static changeEvent = new DigitalEvent<IdbEventPayload | undefined>();
    private static removeEvent = new DigitalEvent<IdbEventPayload | undefined>();

    /**
     * Subscribe to changes in the store
     * @param event - event type, either 'onChange' or 'onRemove'
     * @param cb - callback function to execute when the event occurs, receives the store name and entity as parameters.
     * @returns unsubscribe function
     */
    public static subscribeEvent(event: 'onChange' | 'onRemove', cb: (payload?: IdbEventPayload) => void): () => void {
        if (event === 'onChange') {
            return this.changeEvent.subscribe(cb);
        }
        if (event === 'onRemove') {
            return this.removeEvent.subscribe(cb);
        }
        throw new Error(`IDbStore: error subscribing to event: unknown event "${event}"`);
    }

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
                    IDbStore.changeEvent.emit({ store, id: payload.id! });
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
                IDbStore.removeEvent.emit({ store, id });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}
