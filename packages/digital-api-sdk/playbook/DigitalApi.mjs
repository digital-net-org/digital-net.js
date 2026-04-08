import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { CookieJar } from './CookieJar.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distEntry = resolve(__dirname, '../dist/index.js');

if (!existsSync(distEntry)) {
    console.error(
        '[playbook] dist/index.js not found.\n' +
            'Build the SDK first:\n' +
            '  pnpm --filter @digital-net-org/digital-api-sdk build'
    );
    process.exit(1);
}

if (!globalThis.fetch.__dnCookieJarPatched) {
    const _nativeFetch = globalThis.fetch;
    globalThis.fetch = async (url, opts = {}) => {
        const headers = new Headers(opts.headers ?? {});
        const cookie = CookieJar.serializeJar();
        if (cookie && !headers.has('cookie')) {
            headers.set('Cookie', cookie);
        }

        const res = await _nativeFetch(url, { ...opts, headers });
        CookieJar.ingestSetCookie(res.headers);
        return res;
    };
    globalThis.fetch.__dnCookieJarPatched = true;
}

export const { DigitalApi } = await import(distEntry);
