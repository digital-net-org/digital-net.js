/**
 * Utility class for Environment checks and interactions.
 */
export class Env {
    /**
     * Verify if the current environment has a usable localStorage instance.
     *
     * `typeof localStorage !== 'undefined'` is not sufficient: Node.js ≥22
     * exposes a stub `localStorage` object with no methods unless the process
     * is started with `--localstorage-file`. We must also check that the
     * Storage API methods are actually callable before using it.
     * @returns {boolean}
     */
    static hasUsableLocalStorage() {
        if (typeof localStorage === 'undefined' || localStorage === null) return false;
        return (
            typeof localStorage.getItem === 'function' &&
            typeof localStorage.setItem === 'function' &&
            typeof localStorage.removeItem === 'function'
        );
    }
}
