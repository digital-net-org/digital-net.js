import type { IDbConfig } from './types/IDbConfig';

/**
 * Indexed database accessor utilities
 */
export class IDbAccessor {
    private static pkName = 'id';
    private static pkIndex = 'unique_id';

    private static storeExists(db: IDBDatabase, store: string): boolean {
        return db.objectStoreNames.contains(store);
    }

    /**
     * Initialize the database
     * @param config - database configuration, contains name, version and available stores
     */
    public static async initDatabase(config: IDbConfig): Promise<IDBDatabase | null> {
        return new Promise(resolve => {
            const request = indexedDB.open(config.name, config.version);
            request.onupgradeneeded = () => {
                const db = request.result;
                config.stores.forEach(store => {
                    if (!this.storeExists(db, store)) {
                        const objectStore = db.createObjectStore(store, { keyPath: 'id' });
                        objectStore.createIndex(`${store}_${this.pkIndex}`, this.pkName, { unique: true });
                    }
                });
            };
            request.onerror = () => {
                throw new Error(
                    `IDbAccessor: Unhandled error while initializing ${config.name}" database v${config.version}`
                );
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }
}
