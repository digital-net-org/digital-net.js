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
});
