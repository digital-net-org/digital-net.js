import { DN_API_PAGE, DN_API_PAGE_BY_ID } from '../../routes';
import { CatalogRunner } from '../CatalogRunner';
import type { HttpClient } from '../../HttpClient';
import type { JsonPatchOp, PageDto, Result } from '../../types';
import type { CatalogCallbacks } from '../types';
import type { PagePayload } from './types';

export class PageCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /** GET `cms/pages/:id` — JWT/ApiKey */
    public async getById(id: string, options: CatalogCallbacks<PageDto> = {}): Promise<Result<PageDto>> {
        return CatalogRunner.run<PageDto>(this.http, { path: DN_API_PAGE_BY_ID, slugs: { id } }, options);
    }

    /** POST `cms/pages` — body accepts only `{ path }`. Returns the new id. — JWT/ApiKey */
    public async create(payload: PagePayload, options: CatalogCallbacks<string> = {}): Promise<Result<string>> {
        return CatalogRunner.run<string>(this.http, { method: 'POST', path: DN_API_PAGE, body: payload }, options);
    }

    /** PATCH `cms/pages/:id` — body = JSON Patch (RFC 6902) — JWT/ApiKey */
    public async update(id: string, ops: JsonPatchOp[], options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'PATCH',
                path: DN_API_PAGE_BY_ID,
                slugs: { id },
                body: ops,
                headers: { 'Content-Type': 'application/json-patch+json' },
            },
            options
        );
    }

    /** DELETE `cms/pages/:id` — JWT/ApiKey */
    public async delete(id: string, options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            { method: 'DELETE', path: DN_API_PAGE_BY_ID, slugs: { id } },
            options
        );
    }
}
