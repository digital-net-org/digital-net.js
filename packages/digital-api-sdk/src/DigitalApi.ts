import { Catalog } from './Catalog';
import { HttpClient } from './HttpClient';
import type { HttpClientConfig } from './HttpClient';

/**
 * Top-level SDK entry point. Wraps a single `HttpClient` and exposes a
 * `catalog` namespace that groups every domain endpoint by area:
 *
 * ```ts
 * const api = new DigitalApi({ baseUrl: 'http://localhost:5550' });
 * await api.catalog.auth.login({ login, password });
 * ```
 *
 * The same instance is safe to use from Node and the browser. Auth state is
 * stored in `localStorage` when available and falls back to in-memory storage
 * for Node/server contexts.
 */
export class DigitalApi {
    public readonly http: HttpClient;
    public readonly catalog: Catalog;

    public constructor(config: HttpClientConfig) {
        this.http = new HttpClient(config);
        this.catalog = new Catalog(this.http);
    }
}
