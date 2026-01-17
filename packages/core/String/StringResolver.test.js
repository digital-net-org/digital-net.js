import { describe, it, expect } from 'vitest';
import { StringResolver } from './StringResolver.js';

describe('StringResolver', () => {
    describe('trimSlashes()', () => {
        it.each([
            { input: 'https://example.com/', expected: 'https://example.com' },
            { input: '/auth/login', expected: 'auth/login' },
            { input: '/auth/login/', expected: 'auth/login' },
            { input: 'auth/login', expected: 'auth/login' },
        ])('should transform "$input" to "$expected"', ({ input, expected }) => {
            expect(StringResolver.trimSlashes(input)).toBe(expected);
        });
    });

    describe('toCamelCase()', () => {
        it.each([
            { input: 'someTest', expected: 'someTest' },
            { input: 'SomeTest', expected: 'someTest' },
            { input: 'some_test', expected: 'someTest' },
            { input: 'SOME_TEST', expected: 'someTest' },
        ])('should transform "$input" to "$expected"', ({ input, expected }) => {
            expect(StringResolver.toCamelCase(input)).toBe(expected);
        });
    });

    describe('truncateWithEllipsis()', () => {
        it.each([
            { input: 'Too long sry lol!', maxLength: 6, expected: 'Too...' },
            { input: 'Short', maxLength: 20, expected: 'Short' },
            { input: 'lol', maxLength: 1, expected: '...' },
        ])('should truncate "$input" to "$expected" with limit $maxLength', ({ input, maxLength, expected }) => {
            expect(StringResolver.truncateWithEllipsis(input, maxLength)).toBe(expected);
        });
    });
});
