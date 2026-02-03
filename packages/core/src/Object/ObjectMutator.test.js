import { describe, it, expect } from 'vitest';
import { ObjectMutator } from './ObjectMutator.js';

describe('ObjectMutator.deleteUndefinedEntries', () => {
    it('should recursively delete entries with undefined values', () => {
        const obj = {
            key: undefined,
            definedKey: 'definedKey',
            sub: {
                key: undefined,
                definedKey: 'definedKey',
            },
        };

        const result = ObjectMutator.deleteUndefinedEntries(obj);

        expect(result).toEqual({
            definedKey: 'definedKey',
            sub: {
                definedKey: 'definedKey',
            },
        });
    });

    it('should return a new object and not mutate the original one', () => {
        const obj = { a: undefined, b: 1 };
        const result = ObjectMutator.deleteUndefinedEntries(obj);

        expect(result).not.toBe(obj);
        expect(obj).toHaveProperty('a');
    });
});
