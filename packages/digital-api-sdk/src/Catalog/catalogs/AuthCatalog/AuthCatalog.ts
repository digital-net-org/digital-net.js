import { CatalogRunner } from '../../CatalogRunner';
import type { HttpClient } from '../../../HttpClient';
import type { Result } from '../../../Result';
import type { CatalogCallbacks } from '../../types';
import type { LoginPayload } from './types';

export const DN_API_AUTH_USER_LOGIN = 'authentication/user/login' as const;
export const DN_API_AUTH_USER_IS_LOCKED = 'authentication/user/is-locked' as const;
export const DN_API_AUTH_USER_LOGOUT = 'authentication/user/logout' as const;
export const DN_API_AUTH_USER_LOGOUT_ALL = 'authentication/user/logout-all' as const;
export const DN_API_AUTH_USER_REFRESH = 'authentication/user/refresh' as const;

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
     * GET `authentication/user/is-locked` (public)
     *
     * Returns whether the caller's IP has reached the max login attempts threshold.
     * Intended as a pre-check from the UI to short-circuit login when already locked.
     */
    public async isLocked(options: CatalogCallbacks<boolean> = {}): Promise<Result<boolean>> {
        return CatalogRunner.run<boolean>(
            this.http,
            {
                method: 'GET',
                path: DN_API_AUTH_USER_IS_LOCKED,
                skipAuth: true,
                skipRefresh: true,
            },
            options
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
