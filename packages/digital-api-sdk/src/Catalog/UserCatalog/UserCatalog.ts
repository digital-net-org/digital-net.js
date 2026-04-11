import {
    DN_API_USER_AVATAR_BY_ID,
    DN_API_USER_BY_ID,
    DN_API_USER_SCHEMA,
    DN_API_USER_SELF,
    DN_API_USER_SELF_AVATAR,
    DN_API_USER_SELF_PASSWORD,
} from '../../routes';
import { CatalogRunner } from '../CatalogRunner';
import type { HttpClient } from '../../HttpClient';
import type { Result, UserDto } from '../../types';
import type { CatalogCallbacks } from '../types';
import type { UpdatePasswordPayload, UserSchemaProperty } from './types';

export class UserCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /** GET `user/schema` — JWT/ApiKey */
    public async getSchema(
        options: CatalogCallbacks<UserSchemaProperty[]> = {}
    ): Promise<Result<UserSchemaProperty[]>> {
        return CatalogRunner.run<UserSchemaProperty[]>(this.http, { path: DN_API_USER_SCHEMA }, options);
    }

    /** GET `user/:id` — JWT/ApiKey */
    public async getById(id: string, options: CatalogCallbacks<UserDto> = {}): Promise<Result<UserDto>> {
        return CatalogRunner.run<UserDto>(this.http, { path: DN_API_USER_BY_ID, slugs: { id } }, options);
    }

    /** GET `user/self` — JWT/ApiKey */
    public async getSelf(options: CatalogCallbacks<UserDto> = {}): Promise<Result<UserDto>> {
        return CatalogRunner.run<UserDto>(this.http, { path: DN_API_USER_SELF }, options);
    }

    /** PATCH `user/self` — body = JSON Patch (RFC 6902) — JWT/ApiKey */
    public async patchSelf(
        patch: Array<{ op: string; path: string; value?: unknown }>,
        options: CatalogCallbacks<null> = {}
    ): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'PATCH',
                path: DN_API_USER_SELF,
                body: patch,
                headers: { 'Content-Type': 'application/json-patch+json' },
            },
            options
        );
    }

    /** PUT `user/self/password` — JWT/ApiKey */
    public async updatePassword(payload: UpdatePasswordPayload, options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            { method: 'PUT', path: DN_API_USER_SELF_PASSWORD, body: payload },
            options
        );
    }

    /** PUT `user/self/avatar` — body = FormData with 'avatar' field — JWT/ApiKey */
    public async updateAvatar(file: Blob | File, options: CatalogCallbacks<null> = {}): Promise<Result> {
        const form = new FormData();
        form.append('avatar', file);
        return CatalogRunner.run<null>(
            this.http,
            { method: 'PUT', path: DN_API_USER_SELF_AVATAR, body: form },
            options
        );
    }

    /** DELETE `user/self/avatar` — JWT/ApiKey */
    public async removeAvatar(options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(this.http, { method: 'DELETE', path: DN_API_USER_SELF_AVATAR }, options);
    }

    /** GET `user/:id/avatar` — binary response (image/*) — JWT/ApiKey */
    public async getUserAvatar(id: string, options: CatalogCallbacks<Blob> = {}): Promise<Result<Blob>> {
        return CatalogRunner.run<Blob>(this.http, { path: DN_API_USER_AVATAR_BY_ID, slugs: { id } }, options);
    }
}
