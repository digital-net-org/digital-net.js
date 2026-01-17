/**
 * Utility class for asynchronous operations and promise manipulation.
 */
export class Async {
    /**
     * Pauses the execution for a specified amount of time.
     * @param {number} ms - The number of milliseconds to wait.
     * @returns {Promise<void>}
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
