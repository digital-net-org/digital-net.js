import type { UrlParam } from './useUrlQueryState';

/**
 * Builds `UrlParam<T>` descriptors for use with `useUrlQueryState`. Each
 * descriptor pairs a default value with the query-string key it reads from /
 * writes to, plus the codec (`parse`/`serialize`) suited to its primitive type.
 */
export class UrlParamBuilder {
    public static buildString(defaultValue: string, key: string): UrlParam<string> {
        return {
            defaultValue,
            key,
            parse: raw => raw ?? defaultValue,
            serialize: value => value || null,
        };
    }

    public static buildInt(defaultValue: number, key: string): UrlParam<number> {
        return {
            defaultValue,
            key,
            parse: raw => (raw !== null ? parseInt(raw) || defaultValue : defaultValue),
            serialize: value => String(value),
        };
    }

    public static buildFloat(defaultValue: number, key: string): UrlParam<number> {
        return {
            defaultValue,
            key,
            parse: raw => (raw !== null ? parseFloat(raw) || defaultValue : defaultValue),
            serialize: value => String(value),
        };
    }

    public static buildDate(defaultValue: Date | null, key: string): UrlParam<Date | null> {
        return {
            defaultValue,
            key,
            parse: raw => {
                if (!raw) return defaultValue;
                const d = new Date(raw);
                return isNaN(d.getTime()) ? defaultValue : d;
            },
            serialize: value => value?.toISOString() ?? null,
        };
    }

    public static buildArray(defaultValue: string[], key: string): UrlParam<string[]> {
        return {
            defaultValue,
            key,
            parse: raw => (raw ? raw.split(',').filter(Boolean) : defaultValue),
            serialize: value => (value.length ? value.join(',') : null),
        };
    }

    public static buildObject<T>(defaultValue: T, key: string): UrlParam<T> {
        return {
            defaultValue,
            key,
            parse: raw => {
                if (!raw) return defaultValue;
                try {
                    return JSON.parse(raw) as T;
                } catch {
                    return defaultValue;
                }
            },
            serialize: value => {
                try {
                    const s = JSON.stringify(value);
                    return s === '{}' || s === '[]' || s === 'null' ? null : s;
                } catch {
                    return null;
                }
            },
        };
    }
}
