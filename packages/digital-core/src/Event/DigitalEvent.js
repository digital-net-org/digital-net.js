/**
 * @template T
 * @callback DigitalEventListener
 * @param {T} payload
 * @returns {void}
 */

/**
 * Simple observer/pub-sub utility. Listeners are stored in a Set and
 * invoked synchronously in insertion order when `emit()` is called.
 * @template T
 */
export class DigitalEvent {
    /** @type {Set<DigitalEventListener<T>>} */
    #listeners = new Set();

    /**
     * Dispatches the payload to every subscribed listener.
     * The payload is optional so `DigitalEvent<void>` instances can call `emit()` without arguments.
     * @param {T} [payload]
     * @returns {void}
     */
    emit(payload) {
        this.#listeners.forEach(fn => fn(payload));
    }

    /**
     * Registers a listener and returns an unsubscribe function.
     * @param {DigitalEventListener<T>} fn
     * @returns {() => void}
     */
    subscribe(fn) {
        this.#listeners.add(fn);
        return () => {
            this.#listeners.delete(fn);
        };
    }

    /**
     * Removes every listener. Useful for teardown in tests.
     * @returns {void}
     */
    clear() {
        this.#listeners.clear();
    }

    /**
     * @returns {number}
     */
    get size() {
        return this.#listeners.size;
    }
}
