import { DN_API_ADMIN_UPDATE_USER_ROLE, DN_API_ADMIN_UPDATE_USER_STATUS } from '../../routes';
import { CatalogRunner } from '../CatalogRunner';
import type { HttpClient } from '../../HttpClient';
import type { Result } from '../../types';
import type { CatalogCallbacks } from '../types';
import type { UpdateIsActive, UpdateIsAdmin } from './types';

export class AdminCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /** PUT `/admin/user/:id/role` — JWT/ApiKey */
    public async updateUserRole(body: UpdateIsAdmin, id: string, options: CatalogCallbacks = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'PUT',
                path: DN_API_ADMIN_UPDATE_USER_ROLE,
                body,
                slugs: { id },
            },
            options
        );
    }

    /** PUT `/admin/user/:id/status` — JWT/ApiKey */
    public async updateUserStatus(body: UpdateIsActive, id: string, options: CatalogCallbacks = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'PUT',
                path: DN_API_ADMIN_UPDATE_USER_STATUS,
                body,
                slugs: { id },
            },
            options
        );
    }
}
