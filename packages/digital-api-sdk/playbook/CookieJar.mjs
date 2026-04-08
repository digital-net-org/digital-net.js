export class CookieJar {
    // Minimal cookie jar for Node.js: the native `fetch` does NOT persist cookies
    // between calls (unlike a browser with `credentials: 'include'`), so we wrap
    // `globalThis.fetch` to re-inject Set-Cookie values on every subsequent call.
    // This is required by the backend which pairs the Bearer token with a
    // HttpOnly refresh cookie for JWT-protected routes.
    static #cookieJar = new Map();

    static serializeJar() {
        return [...CookieJar.#cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
    }

    static ingestSetCookie(headers) {
        const setCookies = headers.getSetCookie?.() ?? [];
        for (const raw of setCookies) {
            const [kv] = raw.split(';');
            const eq = kv.indexOf('=');
            if (eq < 0) continue;
            CookieJar.#cookieJar.set(kv.slice(0, eq).trim(), kv.slice(eq + 1).trim());
        }
    }
}