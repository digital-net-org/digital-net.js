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
}
