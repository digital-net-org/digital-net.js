import type { IDbConfig } from './IDbConfig';

export interface IDb extends IDbConfig {
    db: IDBDatabase;
    event: Event;
}
