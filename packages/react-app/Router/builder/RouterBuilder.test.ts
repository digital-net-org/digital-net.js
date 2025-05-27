import { describe, expect, test } from 'vitest';
import RouterBuilder from './RouterBuilder';

describe('RouterBuilder', () => {
    test('buildUrl(): Should return the module router path from component url', () => {
        const results = ['/src/pages/path/page.tsx', '/src/pages/path/subPath/page.tsx', '/src/pages/page.tsx'].map(
            path => RouterBuilder.buildUrl(path),
        );
        expect(results[0]).toEqual('/path');
        expect(results[1]).toEqual('/path/subPath');
        expect(results[2]).toEqual('/');
    });

    test('handleSlug(): transform slug into router param', () => {
        const results = ['/path/[slug]', '/path/[slug]/[slug]'].map(path => RouterBuilder.handleSlug(path));
        expect(results[0]).toEqual('/path/:slug');
        expect(results[1]).toEqual('/path/:slug/:slug');
    });
});
