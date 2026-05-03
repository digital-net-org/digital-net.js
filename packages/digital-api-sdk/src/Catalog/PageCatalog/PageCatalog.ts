import {
    DN_API_PAGE,
    DN_API_PAGE_BY_ID,
    DN_API_PAGE_OG_SCHEMA,
    DN_API_PAGE_OPENGRAPH,
    DN_API_PAGE_PATH_AVAILABILITY,
    DN_API_PAGE_SHEETS,
} from '../../routes';
import { CatalogRunner } from '../CatalogRunner';
import type { HttpClient } from '../../HttpClient';
import type {
    JsonPatchOp,
    OpenGraphEntry,
    OpenGraphPropertySchema,
    PageDto,
    PageSheet,
    Result,
} from '../../types';
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

    /** POST `cms/pages` — body accepts `{ path, entityType? }`. Returns the new id. — JWT/ApiKey */
    public async create(payload: PagePayload, options: CatalogCallbacks<string> = {}): Promise<Result<string>> {
        return CatalogRunner.run<string>(this.http, { method: 'POST', path: DN_API_PAGE, body: payload }, options);
    }

    /** GET `cms/pages/path/availability?path=...&excludeId=...` — JWT/ApiKey */
    public async checkAvailability(
        path: string,
        excludeId?: string,
        options: CatalogCallbacks<boolean> & { signal?: AbortSignal } = {}
    ): Promise<Result<boolean>> {
        const { signal, ...cbs } = options;
        return CatalogRunner.run<boolean>(
            this.http,
            {
                path: DN_API_PAGE_PATH_AVAILABILITY,
                params: { path, ...(excludeId ? { excludeId } : {}) },
                signal,
            },
            cbs
        );
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

    /** GET `cms/pages/schema/open-graph` — Returns the list of valid OpenGraph properties. — JWT/ApiKey */
    public async getOpenGraphSchema(
        options: CatalogCallbacks<OpenGraphPropertySchema[]> = {}
    ): Promise<Result<OpenGraphPropertySchema[]>> {
        return CatalogRunner.run<OpenGraphPropertySchema[]>(this.http, { path: DN_API_PAGE_OG_SCHEMA }, options);
    }

    /** GET `cms/pages/:id/sheets` — Editable sheet list owned by the page (ordered). — JWT/ApiKey */
    public async getSheetsForEdit(
        id: string,
        options: CatalogCallbacks<PageSheet[]> = {}
    ): Promise<Result<PageSheet[]>> {
        return CatalogRunner.run<PageSheet[]>(
            this.http,
            { path: DN_API_PAGE_SHEETS, slugs: { id } },
            options
        );
    }

    /** GET `cms/pages/:id/openGraph` — Editable OpenGraph entries owned by the page (ordered). — JWT/ApiKey */
    public async getOpenGraphForEdit(
        id: string,
        options: CatalogCallbacks<OpenGraphEntry[]> = {}
    ): Promise<Result<OpenGraphEntry[]>> {
        return CatalogRunner.run<OpenGraphEntry[]>(
            this.http,
            { path: DN_API_PAGE_OPENGRAPH, slugs: { id } },
            options
        );
    }
}
