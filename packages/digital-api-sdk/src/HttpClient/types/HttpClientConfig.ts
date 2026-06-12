export interface HttpClientConfig {
    /** Root URL of the API, without trailing slash. Example: 'https://api.domaine.com' */
    baseUrl: string;
    /**
     * Optional long-lived API key. When set, the client uses the API key flow:
     * every request is sent with the `DN-Api-Key` header instead of `Authorization: Bearer ...`,
     * and 401 responses are NOT refreshed (API keys have no refresh mechanism on the server).
     * Provide it once at construction; it cannot be changed after.
     */
    apiKey?: string;
    /**
     * Optional shared application key. Stored on the client and exposed via `getApplicationKey()` for
     * consumers that need it. It is NOT prefixed by `keyPrefix` and NOT attached automatically to regular requests.
     */
    applicationKey?: string;
    /**
     * Optional prefix prepended as-is to both:
     *
     * - `DN_STORAGE_KEY` (the localStorage bucket used for the access token)
     * - `DN_API_KEY_HEADER` (the header name used for the API key auth flow).
     *
     * Useful when several `HttpClient` instances coexist on the same origin (multi-tenant or multi-environment apps)
     * and must not collide on localStorage or on the API key header namespace. Include any separator yourself — for
     * example `'tenant_a_'` becomes `'tenant_a_DN_ACCESS_TOKEN'` and `'tenant_a_DN-Api-Key'`.
     */
    keyPrefix?: string;
}
