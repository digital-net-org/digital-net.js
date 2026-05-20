import { DN_API_ARTICLE, DN_API_ARTICLE_BY_ID } from '../../routes';
import { CatalogRunner } from '../CatalogRunner';
import type { HttpClient } from '../../HttpClient';
import type { ArticleDto, JsonPatchOp, Result } from '../../types';
import type { CatalogCallbacks } from '../types';
import type { ArticlePayload } from './types';

export class ArticleCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /** GET `cms/articles/:id` — JWT/ApiKey */
    public async getById(id: string, options: CatalogCallbacks<ArticleDto> = {}): Promise<Result<ArticleDto>> {
        return CatalogRunner.run<ArticleDto>(this.http, { path: DN_API_ARTICLE_BY_ID, slugs: { id } }, options);
    }

    /** POST `cms/articles` — JWT/ApiKey. Returns the new article id. */
    public async create(payload: ArticlePayload, options: CatalogCallbacks<string> = {}): Promise<Result<string>> {
        return CatalogRunner.run<string>(this.http, { method: 'POST', path: DN_API_ARTICLE, body: payload }, options);
    }

    /** PATCH `cms/articles/:id` — body = JSON Patch (RFC 6902). — JWT/ApiKey */
    public async update(id: string, ops: JsonPatchOp[], options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'PATCH',
                path: DN_API_ARTICLE_BY_ID,
                slugs: { id },
                body: ops,
                headers: { 'Content-Type': 'application/json-patch+json' },
            },
            options
        );
    }

    /** DELETE `cms/articles/:id` — JWT/ApiKey */
    public async delete(id: string, options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            { method: 'DELETE', path: DN_API_ARTICLE_BY_ID, slugs: { id } },
            options
        );
    }
}
