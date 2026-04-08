import {
    DN_API_AUTH_USER_LOGIN,
    DN_API_AUTH_USER_LOGOUT,
    DN_API_AUTH_USER_LOGOUT_ALL,
    DN_API_AUTH_USER_REFRESH,
} from '../../routes';
import { CatalogRunner } from '../CatalogRunner';
import type { HttpClient } from '../../HttpClient';
import type { Result } from '../../types';
import type { CatalogCallbacks } from '../types';
import type { LoginPayload } from './types';

export class AuthCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /**
     * POST `authentication/user/login` (public)
     *
     * On success, persists the bearer token returned.
     */
    public async login(payload: LoginPayload, options: CatalogCallbacks<string> = {}): Promise<Result<string>> {
        return CatalogRunner.run<string>(
            this.http,
            {
                method: 'POST',
                path: DN_API_AUTH_USER_LOGIN,
                body: payload,
                skipAuth: true,
                skipRefresh: true,
            },
            {
                ...options,
                onSuccess: async token => {
                    if (token) this.http.setToken(token);
                    await options.onSuccess?.(token);
                },
            }
        );
    }

    /**
     * POST `authentication/user/logout` (JWT required)
     *
     * Always clears the local token, even on error.
     */
    public async logout(options: CatalogCallbacks<null> = {}): Promise<Result<null>> {
        const result = await CatalogRunner.run<null>(
            this.http,
            {
                method: 'POST',
                path: DN_API_AUTH_USER_LOGOUT,
                skipRefresh: true,
            },
            options
        );
        this.http.clearToken();
        return result;
    }

    /**
     * POST `authentication/user/logout-all` (JWT or ApiKey)
     *
     * Clears local token regardless of outcome.
     */
    public async logoutAll(options: CatalogCallbacks<null> = {}): Promise<Result<null>> {
        const result = await CatalogRunner.run<null>(
            this.http,
            {
                method: 'POST',
                path: DN_API_AUTH_USER_LOGOUT_ALL,
                skipRefresh: true,
            },
            options
        );
        this.http.clearToken();
        return result;
    }

    /**
     * POST `authentication/user/refresh` (public — uses HttpOnly cookie)
     *
     * On success, persists the new bearer token via the underlying HttpClient.
     *
     * Note: most callers should let HttpClient.refreshToken() handle this
     * implicitly on 401. This is exposed for explicit/manual refreshes.
     */
    public async refresh(options: CatalogCallbacks<string> = {}): Promise<Result<string>> {
        return CatalogRunner.run<string>(
            this.http,
            {
                method: 'POST',
                path: DN_API_AUTH_USER_REFRESH,
                skipAuth: true,
                skipRefresh: true,
            },
            {
                ...options,
                onSuccess: async token => {
                    if (token) this.http.setToken(token);
                    await options.onSuccess?.(token);
                },
            }
        );
    }
}
