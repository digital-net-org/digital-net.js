export class IDbStore {
    private static getStore(db: IDBDatabase, store: string, mode: IDBTransactionMode): IDBObjectStore {
        if (!db.objectStoreNames.contains(store)) {
            throw new Error(`IDbStore: store "${store}" does not exist`);
        }
        return db.transaction(store, mode).objectStore(store);
    }

    public static getAll<T>(db: IDBDatabase, store: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const request = this.getStore(db, store, 'readonly').getAll();
            request.onsuccess = () => resolve((request.result ?? []) as T[]);
            request.onerror = () => reject(request.error);
        });
    }

    public static get<T>(db: IDBDatabase, store: string, id: string): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            const request = this.getStore(db, store, 'readonly').get(id);
            request.onsuccess = () => resolve(request.result as T | undefined);
            request.onerror = () => reject(request.error);
        });
    }

    public static save<T extends { id: string }>(db: IDBDatabase, store: string, data: T): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = this.getStore(db, store, 'readwrite').put(data);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public static delete(db: IDBDatabase, store: string, id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = this.getStore(db, store, 'readwrite').delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}
