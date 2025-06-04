import { expect, test } from 'vitest';
import { ObjectMatcher } from './ObjectMatcher';

test('ObjectMatcher: isObject(), Should return true for valid objects only', () => {
    expect(ObjectMatcher.isObject({})).toBe(true);
    expect(ObjectMatcher.isObject({ key: 'value' })).toBe(true);
    expect(ObjectMatcher.isObject([])).toBe(true);

    expect(ObjectMatcher.isObject(42)).toBe(false);
    expect(ObjectMatcher.isObject('string')).toBe(false);
    expect(ObjectMatcher.isObject(true)).toBe(false);
    expect(ObjectMatcher.isObject(null)).toBe(false);
    expect(ObjectMatcher.isObject(undefined)).toBe(false);
});

test('ObjectMatcher: isObject(), Should return correct values for multiple params', () => {
    expect(ObjectMatcher.isObject({}, {})).toBe(true);
    expect(ObjectMatcher.isObject({}, 42)).toBe(false);
});

test('ObjectMatcher: isEmptyObject(), Should detect empty objects properly', () => {
    expect(ObjectMatcher.isEmptyObject({})).toBe(true);
    expect(ObjectMatcher.isEmptyObject({ a: 1 })).toBe(false);
    expect(ObjectMatcher.isEmptyObject([])).toBe(false);
    expect(ObjectMatcher.isEmptyObject(null)).toBe(false);
    expect(ObjectMatcher.isEmptyObject(undefined)).toBe(false);
    expect(ObjectMatcher.isEmptyObject('')).toBe(false);
    expect(ObjectMatcher.isEmptyObject(0)).toBe(false);
});

test('ObjectMatcher: typeEquality(), Should return true for same types only', () => {
    expect(ObjectMatcher.typeEquality(42, 24)).toBe(true);
    expect(ObjectMatcher.typeEquality('a', 'b')).toBe(true);
    expect(ObjectMatcher.typeEquality({}, {})).toBe(true);
    expect(ObjectMatcher.typeEquality([], [])).toBe(true);
    expect(ObjectMatcher.typeEquality([], {})).toBe(true);
    expect(ObjectMatcher.typeEquality(null, null)).toBe(true);
    expect(ObjectMatcher.typeEquality(undefined, undefined)).toBe(true);
    expect(ObjectMatcher.typeEquality(true, true)).toBe(true);

    expect(ObjectMatcher.typeEquality(42, '42')).toBe(false);
    expect(ObjectMatcher.typeEquality('a', 1)).toBe(false);
    expect(ObjectMatcher.typeEquality([], null)).toBe(false);
    expect(ObjectMatcher.typeEquality(null, undefined)).toBe(false);
    expect(ObjectMatcher.typeEquality(undefined, true)).toBe(false);
});

test('ObjectMatcher: objectKeysEquality(), Should return true only for objects with same keys', () => {
    expect(ObjectMatcher.objectKeysEquality({ a: 1, b: 2 }, { a: 3, b: 4 })).toBe(true);
    expect(ObjectMatcher.objectKeysEquality({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false);
});

test('ObjectMatcher: objectKeysEquality(), Should return true only for objects with same keys with nested objects', () => {
    expect(ObjectMatcher.objectKeysEquality({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(true);
    expect(ObjectMatcher.objectKeysEquality({ a: 1, b: { c: 2 } }, { a: 1, b: { d: 2 } })).toBe(false);
});

test('ObjectMatcher: objectKeysEquality(), Should return true only for objects with same keys that are not ignored', () => {
    expect(ObjectMatcher.objectKeysEquality({ a: 1, b: 1 }, { a: 1, b: 1, c: 1 }, ['c'])).toBe(true);
    expect(ObjectMatcher.objectKeysEquality({ a: 1, b: 1 }, { a: 1, c: 1 }, ['c'])).toBe(false);
    expect(ObjectMatcher.objectKeysEquality({ a: 1, b: { c: 1 } }, { a: 1, b: {} }, ['c'])).toBe(true);
    expect(ObjectMatcher.objectKeysEquality({ a: 1, b: { d: 1 } }, { a: 1, b: { c: 1 } }, ['c'])).toBe(false);
});

test('ObjectMatcher: deepEquality(), Should return true only for deeply equal objects', () => {
    expect(ObjectMatcher.deepEquality({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(ObjectMatcher.deepEquality({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
});

test('ObjectMatcher: deepEquality(), Should return true only for deeply equal objects with nested objects', () => {
    expect(ObjectMatcher.deepEquality({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(ObjectMatcher.deepEquality({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toBe(false);
});
