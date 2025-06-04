import { expect, test } from 'vitest';
import { StringResolver } from './StringResolver';

test('StringResolver.trimSlashes(), Should remove surrounding slashes', () => {
    [
        { test: 'https://example.com/', result: 'https://example.com' },
        { test: '/auth/login', result: 'auth/login' },
        { test: '/auth/login/', result: 'auth/login' },
        { test: 'auth/login', result: 'auth/login' },
    ].forEach(({ test, result }) => expect(StringResolver.trimSlashes(test)).toBe(result));
});

test('StringResolver.toCamelCase(), Should transform string in camel case', () => {
    [
        { test: 'someTest', result: 'someTest' },
        { test: 'SomeTest', result: 'someTest' },
        { test: 'some_test', result: 'someTest' },
        { test: 'SOME_TEST', result: 'someTest' },
    ].forEach(({ test, result }) => expect(StringResolver.toCamelCase(test)).toBe(result));
});

test('StringResolver.truncateString(), Should truncate the string and add "..." when exceeding max length', () => {
    [
        { test: { input: 'Too long sry lol!', maxLength: 6 }, result: 'Too...' },
        { test: { input: 'Short', maxLength: 20 }, result: 'Short' },
        { test: { input: 'lol', maxLength: 1 }, result: '...' },
    ].forEach(({ test, result }) => {
        const { input, maxLength } = test;
        expect(StringResolver.truncateWithEllipsis(input, maxLength)).toBe(result);
    });
});
