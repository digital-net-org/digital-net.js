import { describe, it, expect } from 'vitest';
import { PathAnalyzer } from './PathAnalyzer.js';

describe('PathAnalyzer', () => {
    describe('hasDynamicSlug()', () => {
        it.each([
            { path: '/:id', expected: true },
            { path: '/articles/:slug', expected: true },
            { path: '/blog/:slug/comments/:commentId', expected: true },
            { path: '/:_underscored', expected: true },
            { path: '/', expected: false },
            { path: '/home', expected: false },
            { path: '/home/nested', expected: false },
            { path: '/:123bad', expected: false },
            { path: '', expected: false },
            { path: null, expected: false },
            { path: undefined, expected: false },
        ])('should return $expected for path "$path"', ({ path, expected }) => {
            expect(PathAnalyzer.hasDynamicSlug(path)).toBe(expected);
        });
    });
});
