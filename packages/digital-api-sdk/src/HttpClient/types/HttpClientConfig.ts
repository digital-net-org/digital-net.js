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
}
