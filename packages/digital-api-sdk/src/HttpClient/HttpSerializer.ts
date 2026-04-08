export class HttpSerializer {
    public static serializeBody(body: unknown): BodyInit | undefined {
        if (body === undefined || body === null) {
            return undefined;
        }
        if (
            body instanceof FormData ||
            body instanceof Blob ||
            body instanceof ArrayBuffer ||
            body instanceof URLSearchParams ||
            typeof body === 'string'
        ) {
            return body as BodyInit;
        }
        return JSON.stringify(body);
    }

    public static async deserializeBody(response: Response): Promise<unknown> {
        const contentType = response.headers.get('content-type') ?? '';
        if (response.status === 204) return null;
        if (contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch {
                return null;
            }
        }
        return response.text();
    }
}
