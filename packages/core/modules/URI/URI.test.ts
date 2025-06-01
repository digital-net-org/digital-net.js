import { expect, test } from 'vitest';
import URI from './URI';

test('UrlBuilder.build(), Should return a formatted url', () =>
    [
        { test: ['https://example.com/', 'auth', 'login'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', 'auth', 'login'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', '/auth', '/login/'], result: 'https://example.com/auth/login' },
        { test: ['https://example.com', '/auth', 'login'], result: 'https://example.com/auth/login' },
    ].forEach(({ test, result }) => expect(URI.resolve(...test)).toBe(result)));

test('UrlBuilder.buildParams(), Should return a formatted query string', () =>
    [
        { test: { key: 'value', key2: 'value2', key3: 'value3' }, result: 'key=value&key2=value2&key3=value3' },
        { test: { key: 'value', key2: 'value2', key3: undefined }, result: 'key=value&key2=value2' },
        { test: { key: 'value', key2: 'value2', key3: null }, result: 'key=value&key2=value2' },
        { test: { key: 'value', key2: 'value2', key3: '' }, result: 'key=value&key2=value2' },
        { test: { key: 'value', key2: 'value2', key3: 0 }, result: 'key=value&key2=value2&key3=0' },
    ].forEach(({ test, result }) => expect(URI.buildParams(test)).toBe(result)));

test('UrlBuilder.buildQuery(), Should return a formatted url with query string', () =>
    [
        {
            test: { url: 'https://localhost:3000/', params: { key: 'value', key2: 'value2', key3: 'value3' } },
            result: 'https://localhost:3000/?key=value&key2=value2&key3=value3',
        },
        {
            test: { url: 'https://localhost:3000/example', params: { key: 'value', key2: 'value2', key3: 'value3' } },
            result: 'https://localhost:3000/example?key=value&key2=value2&key3=value3',
        },
        { test: { url: 'https://localhost:3000/example', params: null }, result: 'https://localhost:3000/example' },
    ].forEach(({ test, result }) => expect(URI.buildQuery(test.url, test.params)).toBe(result)));

test('applyParams(), Should replace slugs in the path with given params', () => {
    [
        {
            url: '/user/:id',
            params: { id: 123 },
            result: '/user/123',
        },
        {
            url: '/user/:id/profile/:section?debug=true&sort=:asc',
            params: { id: 123, section: 'settings', asc: 'test' },
            result: '/user/123/profile/settings?debug=true&sort=:asc',
        },
        {
            url: '/user/:id/profile/:section',
            params: { id: 123 },
            result: '/user/123/profile/:section',
        },
        {
            url: '/static/path',
            params: { id: 1 },
            result: '/static/path',
        },
    ].forEach(({ url, params, result }) => {
        expect(URI.resolveSlugs(url, params)).toBe(result);
    });
});
