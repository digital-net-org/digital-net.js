/**
 * Collection of functions that generates hashes
 */
export class Hash {
    /**
     * Generates a fast, deterministic 32-bit non-cryptographic hash.
     * Implementation of the FNV-1a algorithm for ultra-low latency ID generation.
     * @warning Not suitable for security or large-scale datasets (collision risk > 70k entries).
     * @param {string} str - The input string to hash.
     * @returns {string} 8-character hexadecimal representation of the hash.
     */
    static fastHash(str) {
        let hash = 0x811c9dc5;
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash = Math.imul(hash, 0x01000193);
        }
        return (hash >>> 0).toString(16);
    }
}
