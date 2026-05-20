import { describe, it, expect } from 'vitest';
import { StringValidation } from './StringValidation.js';

describe('StringValidation', () => {
    describe('buildSafeRegex()', () => {
        it('should return undefined for empty/nullish input', () => {
            expect(StringValidation.buildSafeRegex(undefined)).toBeUndefined();
            expect(StringValidation.buildSafeRegex(null)).toBeUndefined();
            expect(StringValidation.buildSafeRegex('')).toBeUndefined();
        });

        it('should build an anchored RegExp from a valid pattern', () => {
            const regex = StringValidation.buildSafeRegex('[a-z]+');
            expect(regex).toBeInstanceOf(RegExp);
            expect(regex.test('abc')).toBe(true);
            expect(regex.test('abc1')).toBe(false);
            expect(regex.test('')).toBe(false);
        });

        it('should remain valid when the source pattern is already anchored', () => {
            const regex = StringValidation.buildSafeRegex('^[a-z]+$');
            expect(regex).toBeInstanceOf(RegExp);
            expect(regex.test('abc')).toBe(true);
            expect(regex.test('abc1')).toBe(false);
        });

        it('should return undefined for invalid patterns', () => {
            expect(StringValidation.buildSafeRegex('(unclosed')).toBeUndefined();
            expect(StringValidation.buildSafeRegex('[invalid')).toBeUndefined();
        });
    });
});
