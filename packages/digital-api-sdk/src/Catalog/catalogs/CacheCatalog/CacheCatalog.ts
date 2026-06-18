import { CatalogRunner } from '../../CatalogRunner';
import type { HttpClient } from '../../../HttpClient';
import type { Result } from '../../../Result';
import type { CatalogCallbacks } from '../../types';

export const DN_API_CACHE_INVALIDATE = 'cache/invalidate' as const;

export class CacheCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /**
     * POST `cache/invalidate` (Application auth)
     *
     * Flushes the entire Redis cache database. Returns the number of keys removed.
     */
    public async invalidate(options: CatalogCallbacks<number> = {}): Promise<Result<number>> {
        return CatalogRunner.run<number>(this.http, { method: 'POST', path: DN_API_CACHE_INVALIDATE }, options);
    }
}
