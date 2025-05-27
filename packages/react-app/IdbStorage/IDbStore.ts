import type { Entity } from '@digital-net/dto';

/**
 * Indexed database store accessor utilities
 */
export class IDbStore {
    private static validateStore(db: IDBDatabase, store: string): void {
        if (![...db.objectStoreNames].includes(store)) {
            throw new Error(`IDbStore: error getting data: store "${store}" does not exist`);
        }
    }

    private static validatePayload<T extends Entity>(data: Partial<T>): Partial<T> {
        if (!data.id) {
            throw new Error('IDbStore: error saving data: id is required');
        }
        return { ...data, updatedAt: new Date(Date.now()), id: String(data.id) };
    }

    private static getStore(db: IDBDatabase, store: string, mode?: IDBTransactionMode): IDBObjectStore {
        return db.transaction(store, mode ?? 'readwrite').objectStore(store);
    }

    /**
     * Retrieve Entity from the store
     * @param db - database instance
     * @param store - store name
     * @param id - entity id
     */
    public static async get<T extends Entity>(
        db: IDBDatabase,
        store: string,
        id: string | number
    ): Promise<T | undefined> {
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
    public static async save<T extends Entity>(db: IDBDatabase, store: string, data: Partial<T>): Promise<void> {
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
    public static async delete<T extends Entity>(db: IDBDatabase, store: string, id: string | number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                this.validateStore(db, store);
                this.getStore(db, store, 'readwrite').delete(String(id));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}
