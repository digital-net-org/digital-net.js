import { DN_API_PING } from '../../routes';
import type { HttpClient } from '../../HttpClient';

export interface PingCallbacks {
    onSuccess?: () => void | Promise<void>;
    onError?: (_error: unknown) => void | Promise<void>;
}

export class ApplicationCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /**
     * GET `/ping` (public, out-of-schema)
     *
     * Health-check endpoint. The API responds with the plain text `"pong"`,
     * NOT wrapped in a `Result<T>`. Returns `true` when the API is reachable
     * and answered correctly, `false` otherwise. Never throws.
     */
    public async ping(options: PingCallbacks = {}): Promise<boolean> {
        try {
            const { data } = await this.http.request<string>({
                method: 'GET',
                path: DN_API_PING,
                skipAuth: true,
                skipRefresh: true,
            });
            if (data !== 'pong') {
                await options.onError?.(new Error(`Unexpected ping response: ${String(data)}`));
                return false;
            }
            await options.onSuccess?.();
            return true;
        } catch (e) {
            await options.onError?.(e);
            return false;
        }
    }
}
