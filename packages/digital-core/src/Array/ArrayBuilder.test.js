import { describe, it, expect, vi } from 'vitest';
import { ArrayBuilder } from './ArrayBuilder.js';

describe('ArrayBuilder', () => {
    it('should create an array with the correct length', () => {
        const length = 5;
        const result = ArrayBuilder.build(length, i => i);
        expect(result).toHaveLength(length);
    });

    it('should call the resolver function for each index', () => {
        const length = 3;
        const resolver = vi.fn(i => i);
        const result = ArrayBuilder.build(length, resolver);
        expect(result).toEqual([0, 1, 2]);
        expect(resolver).toHaveBeenCalledTimes(length);
    });

    it('should handle empty arrays (length 0)', () => {
        const result = ArrayBuilder.build(0, i => i);
        expect(result).toEqual([]);
    });

    describe('chunk', () => {
        it('should split an array into chunks of the given size', () => {
            const result = ArrayBuilder.chunk([1, 2, 3, 4, 5, 6, 7], 3);
            expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
        });

        it('should return a single chunk when size is greater than the array length', () => {
            const result = ArrayBuilder.chunk([1, 2], 5);
            expect(result).toEqual([[1, 2]]);
        });

        it('should return an empty array when input is empty', () => {
            const result = ArrayBuilder.chunk([], 3);
            expect(result).toEqual([]);
        });

        it('should throw when size is zero or negative', () => {
            expect(() => ArrayBuilder.chunk([1, 2, 3], 0)).toThrow();
            expect(() => ArrayBuilder.chunk([1, 2, 3], -1)).toThrow();
        });
    });
});
