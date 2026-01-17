import { describe, it, expect } from 'vitest';
import { ObjectMatcher } from './ObjectMatcher.js';

describe('ObjectMatcher', () => {
    describe('isObject()', () => {
        it('should return true for valid objects only', () => {
            expect(ObjectMatcher.isObject({})).toBe(true);
            expect(ObjectMatcher.isObject({ key: 'value' })).toBe(true);
            expect(ObjectMatcher.isObject([])).toBe(true);

            expect(ObjectMatcher.isObject(42)).toBe(false);
            expect(ObjectMatcher.isObject('string')).toBe(false);
            expect(ObjectMatcher.isObject(true)).toBe(false);
            expect(ObjectMatcher.isObject(null)).toBe(false);
            expect(ObjectMatcher.isObject(undefined)).toBe(false);
        });

        it('should return correct values for multiple params', () => {
            expect(ObjectMatcher.isObject({}, {})).toBe(true);
            expect(ObjectMatcher.isObject({}, 42)).toBe(false);
        });
    });

    describe('isEmptyObject()', () => {
        it('should detect empty objects properly', () => {
            expect(ObjectMatcher.isEmptyObject({})).toBe(true);
            expect(ObjectMatcher.isEmptyObject({ a: 1 })).toBe(false);
            expect(ObjectMatcher.isEmptyObject([])).toBe(false);
            expect(ObjectMatcher.isEmptyObject(null)).toBe(false);
        });
    });

    describe('typeEquality()', () => {
        it('should return true for same types only', () => {
            expect(ObjectMatcher.typeEquality(42, 24)).toBe(true);
            expect(ObjectMatcher.typeEquality(null, null)).toBe(true);
            expect(ObjectMatcher.typeEquality(42, '42')).toBe(false);
            expect(ObjectMatcher.typeEquality(null, undefined)).toBe(false);
        });
    });

    describe('objectKeysEquality()', () => {
        it('should return true for objects with same keys', () => {
            expect(ObjectMatcher.objectKeysEquality({ a: 1, b: 2 }, { a: 3, b: 4 })).toBe(true);
            expect(ObjectMatcher.objectKeysEquality({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
        });

        it('should handle nested objects and ignored keys', () => {
            expect(ObjectMatcher.objectKeysEquality({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(true);
            expect(ObjectMatcher.objectKeysEquality({ a: 1, b: 1 }, { a: 1, b: 1, c: 1 }, ['c'])).toBe(true);
        });
    });

    describe('deepEquality()', () => {
        it('should handle primitive values', () => {
            expect(ObjectMatcher.deepEquality(42, 42)).toBe(true);
            expect(ObjectMatcher.deepEquality(42, '42')).toBe(false);
        });

        it('should handle nested objects equality', () => {
            const obj1 = { a: 1, b: { c: 2 } };
            const obj2 = { a: 1, b: { c: 2 } };
            const obj3 = { a: 1, b: { c: 3 } };

            expect(ObjectMatcher.deepEquality(obj1, obj2)).toBe(true);
            expect(ObjectMatcher.deepEquality(obj1, obj3)).toBe(false);
        });
    });
});
