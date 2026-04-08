import { AuthCatalog } from './AuthCatalog';
import type { HttpClient } from '../HttpClient';

/**
 * Aggregates every domain catalog exposed by the SDK.
 */
export class Catalog {
    public readonly auth: AuthCatalog;

    public constructor(http: HttpClient) {
        this.auth = new AuthCatalog(http);
    }
}
