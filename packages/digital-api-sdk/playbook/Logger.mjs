export class Logger {
    static #SENSITIVE_KEYS = new Set(['password', 'currentPassword', 'newPassword']);

    static maskBody(body) {
        if (body == null || typeof body !== 'object') return body;
        const clone = Array.isArray(body) ? [...body] : { ...body };
        for (const key of Object.keys(clone)) {
            if (Logger.#SENSITIVE_KEYS.has(key)) clone[key] = '***';
            else if (typeof clone[key] === 'object') clone[key] = maskBody(clone[key]);
        }
        return clone;
    }

    static truncateToken(value) {
        if (typeof value !== 'string') return value;
        if (value.length <= 16) return value;
        return `${value.slice(0, 12)}…(${value.length} chars)`;
    }

    static fmt(value) {
        return JSON.stringify(value, null, 2)
            ?.split('\n')
            .map(line => `  ${line}`)
            .join('\n');
    }

    static logRequest(method, path, body) {
        console.log(`\n→ ${method} ${path}`);
        if (body !== undefined) {
            console.log('  body:');
            console.log(Logger.fmt(Logger.maskBody(body)));
        }
    }

    static logResult(result) {
        const display =
            result?.value && typeof result.value === 'string'
                ? { ...result, value: Logger.truncateToken(result.value) }
                : result;
        console.log(Logger.fmt(display));
    }
}