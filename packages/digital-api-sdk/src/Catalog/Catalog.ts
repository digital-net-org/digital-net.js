import { AuthCatalog } from './AuthCatalog';
import { UserCatalog } from './UserCatalog';
import type { HttpClient } from '../HttpClient';

/**
 * Aggregates every domain catalog exposed by the SDK.
 */
export class Catalog {
    public readonly auth: AuthCatalog;
    public readonly user: UserCatalog;

    public constructor(http: HttpClient) {
        this.auth = new AuthCatalog(http);
        this.user = new UserCatalog(http);
    }
}
