import {
    DN_API_MEDIA,
    DN_API_MEDIA_BY_ID,
    DN_API_MEDIA_CONTENT_TYPES,
    DN_API_MEDIA_IMAGE,
    DN_API_MEDIA_LABELS,
    DN_API_MEDIA_MAX_SIZE,
    DN_API_MEDIA_VARIANT_BY_ID,
    DN_API_MEDIA_VARIANTS_OF_MEDIA,
    DN_API_MEDIA_VARIANTS_PURGE_ALL,
} from '../../routes';
import { CatalogRunner } from '../CatalogRunner';
import type { HttpClient } from '../../HttpClient';
import type { JsonPatchOp, MediaDto, Result } from '../../types';
import type { CatalogCallbacks } from '../types';

export class MediaCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /** GET `cms/media/:id` — JWT/ApiKey */
    public async getById(id: string, options: CatalogCallbacks<MediaDto> = {}): Promise<Result<MediaDto>> {
        return CatalogRunner.run<MediaDto>(this.http, { path: DN_API_MEDIA_BY_ID, slugs: { id } }, options);
    }

    /** POST `cms/media` — multipart/form-data. Returns the new media id. — JWT/ApiKey */
    public async upload(file: File, options: CatalogCallbacks<string> = {}): Promise<Result<string>> {
        const form = new FormData();
        form.append('file', file);
        form.append('name', MediaCatalog.normalizeFilename(file.name));
        return CatalogRunner.run<string>(this.http, { method: 'POST', path: DN_API_MEDIA, body: form }, options);
    }

    /** PATCH `cms/media/:id` — body = JSON Patch (RFC 6902). — JWT/ApiKey */
    public async update(id: string, ops: JsonPatchOp[], options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'PATCH',
                path: DN_API_MEDIA_BY_ID,
                slugs: { id },
                body: ops,
                headers: { 'Content-Type': 'application/json-patch+json' },
            },
            options
        );
    }

    /** DELETE `cms/media/:id` — removes the media, its original Document and all cached variants. — JWT/ApiKey */
    public async delete(id: string, options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            { method: 'DELETE', path: DN_API_MEDIA_BY_ID, slugs: { id } },
            options
        );
    }

    /** GET `cms/media/content-types` — list of MIME types accepted by the upload endpoint. — JWT/ApiKey */
    public async getContentTypes(
        options: CatalogCallbacks<readonly string[]> = {}
    ): Promise<Result<readonly string[]>> {
        return CatalogRunner.run<readonly string[]>(this.http, { path: DN_API_MEDIA_CONTENT_TYPES }, options);
    }

    /** GET `cms/media/max-size` — maximum file size (in bytes) accepted by the upload endpoint. — JWT/ApiKey */
    public async getMaxSize(options: CatalogCallbacks<number> = {}): Promise<Result<number>> {
        return CatalogRunner.run<number>(this.http, { path: DN_API_MEDIA_MAX_SIZE }, options);
    }

    /**
     * GET `cms/media/labels?search=…` — distinct labels currently in use across all
     * ArticleMedia/PageMedia pivots, alphabetically sorted. `search` is an optional case-insensitive
     * substring filter.
     * Pass `options.signal` to cancel an in-flight request (debounced autocomplete pattern). — JWT/ApiKey
     */
    public async getLabels(
        params: { search?: string } = {},
        options: CatalogCallbacks<string[]> & { signal?: AbortSignal } = {}
    ): Promise<Result<string[]>> {
        const { signal, ...cbs } = options;
        return CatalogRunner.run<string[]>(this.http, { path: DN_API_MEDIA_LABELS, params, signal }, cbs);
    }

    /** DELETE `cms/media/variants/:variantId` — purges a single cached variant. — JWT/ApiKey */
    public async purgeVariant(variantId: string, options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            { method: 'DELETE', path: DN_API_MEDIA_VARIANT_BY_ID, slugs: { variantId } },
            options
        );
    }

    /** DELETE `cms/media/:id/variants` — purges every cached variant of one media. — JWT/ApiKey */
    public async purgeMediaVariants(mediaId: string, options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            { method: 'DELETE', path: DN_API_MEDIA_VARIANTS_OF_MEDIA, slugs: { id: mediaId } },
            options
        );
    }

    /** DELETE `cms/media/variants` — purges every cached variant across the whole system. — JWT/ApiKey */
    public async purgeAllVariants(options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(this.http, { method: 'DELETE', path: DN_API_MEDIA_VARIANTS_PURGE_ALL }, options);
    }

    /**
     * GET `cms/media/image/:id.:ext` — fetches the binary asset through the authenticated `HttpClient`.
     * Use this in the backoffice (where `<img src>` cannot carry the Bearer token).
     * — JWT/ApiKey/Application
     */
    public async getImageBlob(
        mediaId: string,
        options: { width?: number; quality?: number; extension?: string } = {},
        callbacks: CatalogCallbacks<Blob> = {}
    ): Promise<Result<Blob>> {
        const params: Record<string, unknown> = {};
        if (options.width !== undefined) params.w = options.width;
        if (options.quality !== undefined) params.q = options.quality;
        return CatalogRunner.run<Blob>(
            this.http,
            {
                path: DN_API_MEDIA_IMAGE,
                slugs: { id: mediaId, ext: options.extension ?? 'webp' },
                params,
            },
            callbacks
        );
    }

    /**
     * Builds the absolute URL of a media image, optionally resized/recompressed by the backend.
     * Pure helper — no HTTP call. SVGs are pass-through on the backend regardless of `width` / `quality`.
     */
    public getImageUrl(
        mediaId: string,
        options: { width?: number; quality?: number; extension?: string } = {}
    ): string {
        const ext = options.extension ?? 'webp';
        const params = new URLSearchParams();
        if (options.width !== undefined) params.set('w', String(options.width));
        if (options.quality !== undefined) params.set('q', String(options.quality));
        const query = params.toString();
        const base = this.http.getBaseUrl().replace(/\/+$/, '');
        const path = `cms/media/image/${mediaId}.${ext}`;
        return query ? `${base}/${path}?${query}` : `${base}/${path}`;
    }

    private static normalizeFilename(rawFileName: string): string {
        const lastDot = rawFileName.lastIndexOf('.');
        const withoutExtension = lastDot > 0 ? rawFileName.slice(0, lastDot) : rawFileName;
        const cleaned = withoutExtension
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9._-]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
        return cleaned.length > 0 ? cleaned : 'untitled';
    }
}
