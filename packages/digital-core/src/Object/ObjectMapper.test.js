import { describe, it, expect } from 'vitest';
import { ObjectMapper } from './ObjectMapper.js';

describe('ObjectMapper.pick', () => {
    it('should keep only the provided keys', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(ObjectMapper.pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });

    it('should skip keys absent from the source object', () => {
        const obj = { a: 1 };
        expect(ObjectMapper.pick(obj, ['a', 'missing'])).toEqual({ a: 1 });
    });

    it('should preserve falsy and undefined-but-present values', () => {
        const obj = { a: 0, b: '', c: undefined };
        expect(ObjectMapper.pick(obj, ['a', 'b', 'c'])).toEqual({ a: 0, b: '', c: undefined });
    });

    it('should return a new object without mutating the source', () => {
        const obj = { a: 1, b: 2 };
        const result = ObjectMapper.pick(obj, ['a']);
        expect(result).not.toBe(obj);
        expect(obj).toEqual({ a: 1, b: 2 });
    });
});

describe('ObjectMapper.omit', () => {
    it('should drop the provided keys', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(ObjectMapper.omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
    });

    it('should ignore keys absent from the source object', () => {
        const obj = { a: 1, b: 2 };
        expect(ObjectMapper.omit(obj, ['missing'])).toEqual({ a: 1, b: 2 });
    });

    it('should return a new object without mutating the source', () => {
        const obj = { a: 1, b: 2 };
        const result = ObjectMapper.omit(obj, ['a']);
        expect(result).not.toBe(obj);
        expect(obj).toEqual({ a: 1, b: 2 });
    });
});
