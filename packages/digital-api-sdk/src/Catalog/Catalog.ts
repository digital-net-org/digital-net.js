import { AdminCatalog } from './AdminCatalog';
import { ApplicationCatalog } from './ApplicationCatalog';
import { ArticleCatalog } from './ArticleCatalog';
import { AuthCatalog } from './AuthCatalog';
import { CatalogRunner } from './CatalogRunner';
import { ConfigValueCatalog } from './ConfigValueCatalog';
import { FormCatalog } from './FormCatalog';
import { MediaCatalog } from './MediaCatalog';
import { PageCatalog } from './PageCatalog';
import { TagCatalog } from './TagCatalog';
import { UserCatalog } from './UserCatalog';
import type { HttpClient } from '../HttpClient';
import type { Result, SchemaProperty } from '../types';
import type { CatalogCallbacks } from './types';

/**
 * Aggregates every domain catalog exposed by the SDK.
 */
export class Catalog {
    private readonly http: HttpClient;
    public readonly admin: AdminCatalog;
    public readonly application: ApplicationCatalog;
    public readonly article: ArticleCatalog;
    public readonly auth: AuthCatalog;
    public readonly configValue: ConfigValueCatalog;
    public readonly form: FormCatalog;
    public readonly media: MediaCatalog;
    public readonly page: PageCatalog;
    public readonly tag: TagCatalog;
    public readonly user: UserCatalog;

    public constructor(http: HttpClient) {
        this.http = http;
        this.admin = new AdminCatalog(http);
        this.application = new ApplicationCatalog(http);
        this.article = new ArticleCatalog(http);
        this.auth = new AuthCatalog(http);
        this.configValue = new ConfigValueCatalog(http);
        this.form = new FormCatalog(http);
        this.media = new MediaCatalog(http);
        this.page = new PageCatalog(http);
        this.tag = new TagCatalog(http);
        this.user = new UserCatalog(http);
    }

    /** GET `{path}/schema` — Returns the schema for any entity endpoint. */
    public async getSchema(
        path: string,
        options: CatalogCallbacks<SchemaProperty[]> = {}
    ): Promise<Result<SchemaProperty[]>> {
        return CatalogRunner.run<SchemaProperty[]>(this.http, { path: `${path}/schema` }, options);
    }
}
