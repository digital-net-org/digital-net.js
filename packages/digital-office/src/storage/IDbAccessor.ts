import type { IDbConfig } from './types';

export class IDbAccessor {
    public static initDatabase(config: IDbConfig): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(config.name, config.version);
            request.onupgradeneeded = () => {
                const db = request.result;
                config.stores.forEach(store => {
                    if (!db.objectStoreNames.contains(store)) {
                        db.createObjectStore(store, { keyPath: 'id' });
                    }
                });
            };
            request.onerror = () => reject(request.error ?? new Error(`IDbAccessor: failed to open "${config.name}"`));
            request.onsuccess = () => resolve(request.result);
        });
    }
}
