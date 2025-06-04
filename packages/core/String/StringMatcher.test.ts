import { expect, test } from 'vitest';
import { StringMatcher } from './StringMatcher';

test('StringMatcher.isEmpty(), Should return true if string is empty', () => {
    expect(StringMatcher.isEmpty('')).toBe(true);
    expect(StringMatcher.isEmpty(' ')).toBe(false);
    expect(StringMatcher.isEmpty('test')).toBe(false);
    expect(StringMatcher.isEmpty(undefined)).toBe(true);
});

test('StringMatcher.isCamelCase(), Should return true if string is in camel case', () => {
    expect(StringMatcher.isCamelCase('someTest')).toBe(true);
    expect(StringMatcher.isCamelCase('someTestButLonger')).toBe(true);
    expect(StringMatcher.isCamelCase('SomeTest')).toBe(false);
    expect(StringMatcher.isCamelCase('some test')).toBe(false);
    expect(StringMatcher.isCamelCase('some_test')).toBe(false);
    expect(StringMatcher.isCamelCase('some-test')).toBe(false);
});

test('StringMatcher.isPascalCase(), Should return true if string is in pascal case', () => {
    expect(StringMatcher.isPascalCase('SomeTest')).toBe(true);
    expect(StringMatcher.isPascalCase('SomeTestButLonger')).toBe(true);
    expect(StringMatcher.isPascalCase('someTest')).toBe(false);
    expect(StringMatcher.isPascalCase('some test')).toBe(false);
    expect(StringMatcher.isPascalCase('some_test')).toBe(false);
    expect(StringMatcher.isPascalCase('some-test')).toBe(false);
});

test('StringMatcher.isSnakeCase(), Should return true if string is in snake case', () => {
    expect(StringMatcher.isSnakeCase('some_test')).toBe(true);
    expect(StringMatcher.isSnakeCase('some_test_but_longer')).toBe(true);
    expect(StringMatcher.isSnakeCase('someTest')).toBe(false);
    expect(StringMatcher.isSnakeCase('some test')).toBe(false);
    expect(StringMatcher.isSnakeCase('some-test')).toBe(false);
});

test('StringMatcher.isUpperSnakeCase(), Should return true if string is in upper snake case', () => {
    expect(StringMatcher.isUpperSnakeCase('SOME_TEST')).toBe(true);
    expect(StringMatcher.isUpperSnakeCase('SOME_TEST_BUT_LONGER')).toBe(true);
    expect(StringMatcher.isUpperSnakeCase('SOME_TEST')).toBe(true);
    expect(StringMatcher.isUpperSnakeCase('someTest')).toBe(false);
    expect(StringMatcher.isUpperSnakeCase('some test')).toBe(false);
    expect(StringMatcher.isUpperSnakeCase('some-test')).toBe(false);
});
