/**
 * Utility class for building Arrays
 */
export class ArrayBuilder {
    /**
     * Creates an array of a specific length using the provided resolver function.
     * @template T
     * @param {number} length - The length of the array to create.
     * @param {function(number): T} resolver - A function that takes an index and returns a value of type T.
     * @returns {T[]} An array of type T populated by the resolver function.
     */
    static build(length, resolver) {
        return Array.from({ length }, (_, i) => resolver(i));
    }

    /**
     * Splits an array into sub-arrays of a given size. The last chunk may be smaller.
     * @template T
     * @param {T[]} arr - The array to split.
     * @param {number} size - The maximum size of each chunk. Must be greater than 0.
     * @returns {T[][]} An array of chunks.
     */
    static chunk(arr, size) {
        if (size <= 0) throw new Error('ArrayBuilder.chunk: size must be greater than 0');
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
        return chunks;
    }
}
