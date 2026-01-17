/**
 * Utility class for URL manipulation, path resolution, and query string building.
 */
export class URLResolver {
    /**
     * Joins strings into a formatted URL, preventing double slashes (except after protocol).
     * @param {...string} paths
     * @returns {string}
     */
    static resolve(...paths) {
        return paths
            .join('/')
            .replace(/(^|[^:])\/{2,}/g, '$1/')
            .replace(/\/+$/, '');
    }

    /**
     * Builds a formatted query string with URI encoding.
     * @param {Object.<string, any>} [params]
     * @returns {string}
     */
    static buildQueryString(params) {
        if (!params || typeof params !== 'object') {
            return '';
        }

        const query = Object.entries(params)
            .filter(([, value]) => value !== null && value !== undefined)
            .flatMap(([key, value]) => {
                if (Array.isArray(value)) {
                    return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
                }
                return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
            })
            .join('&');

        return query ? `?${query}` : '';
    }

    /**
     * Combines a URL and a parameters object into a full URL with query string.
     * @param {string} url
     * @param {Object.<string, any>} [query]
     * @returns {string}
     */
    static buildQuery(url, query) {
        const queryString = this.buildQueryString(query);
        // Remove trailing slash from URL if query exists to avoid /?
        const base = queryString ? url.replace(/\/$/, '') : url;
        return `${base}${queryString}`;
    }

    /**
     * Replaces path variables (e.g., :id) with values from a slugs object.
     * @param {string} url
     * @param {Object.<string, string|number>} [slugs={}]
     * @returns {string}
     */
    static resolveSlugs(url, slugs = {}) {
        const [path, query] = url.split('?');
        const parsed = path.replace(/:([a-zA-Z0-9_]+)/g, (match, key) =>
            key in slugs ? encodeURIComponent(String(slugs[key])) : match
        );
        return query ? `${parsed}?${query}` : parsed;
    }
}
