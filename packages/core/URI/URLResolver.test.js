import { describe, it, expect } from 'vitest';
import { URLResolver } from './URLResolver.js';

describe('URLResolver', () => {
    describe('resolve()', () => {
        it.each([
            { paths: ['https://example.com/', 'auth', 'login'], expected: 'https://example.com/auth/login' },
            { paths: ['https://example.com', 'auth', 'login'], expected: 'https://example.com/auth/login' },
            { paths: ['https://example.com', '/auth', '/login/'], expected: 'https://example.com/auth/login' },
            { paths: ['https://example.com', '/auth', 'login'], expected: 'https://example.com/auth/login' },
        ])('should resolve $paths to $expected', ({ paths, expected }) => {
            expect(URLResolver.resolve(...paths)).toBe(expected);
        });
    });

    describe('buildQueryString()', () => {
        it.each([
            { params: { a: '1', b: '2' }, expected: '?a=1&b=2' },
            { params: { a: '1', b: undefined, c: null }, expected: '?a=1' },
            { params: { a: 0 }, expected: '?a=0' },
            { params: { tags: ['js', 'ts'] }, expected: '?tags=js&tags=ts' },
            { params: {}, expected: '' },
        ])('should build query string $expected from $params', ({ params, expected }) => {
            expect(URLResolver.buildQueryString(params)).toBe(expected);
        });
    });

    describe('buildQuery()', () => {
        it.each([
            {
                url: 'https://localhost:3000/',
                params: { key: 'value' },
                expected: 'https://localhost:3000?key=value',
            },
            {
                url: 'https://localhost:3000/api',
                params: null,
                expected: 'https://localhost:3000/api',
            },
        ])('should combine URL and params into $expected', ({ url, params, expected }) => {
            expect(URLResolver.buildQuery(url, params)).toBe(expected);
        });
    });

    describe('resolveSlugs()', () => {
        it.each([
            {
                url: '/user/:id',
                slugs: { id: 123 },
                expected: '/user/123',
            },
            {
                url: '/user/:id/profile/:section?debug=true',
                slugs: { id: 123, section: 'settings' },
                expected: '/user/123/profile/settings?debug=true',
            },
            {
                url: '/user/:id',
                slugs: {},
                expected: '/user/:id',
            },
        ])('should replace slugs in $url to get $expected', ({ url, slugs, expected }) => {
            expect(URLResolver.resolveSlugs(url, slugs)).toBe(expected);
        });
    });
});
