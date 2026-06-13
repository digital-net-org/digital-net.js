import { describe, expect, it } from 'vitest';
import { ENTITY_NAMES } from '../EntityName';
import { parseEntityName } from './parseEntityName';

describe('parseEntityName', () => {
    it.each([
        ['Article', 'article'],
        ['Page', 'page'],
        ['FormField', 'formField'],
        ['FormSubmission', 'formSubmission'],
        ['ConfigValue', 'configValue'],
        ['User', 'user'],
    ])('resolves the CLR name %s to %s', (clrName, expected) => {
        expect(parseEntityName(clrName)).toBe(expected);
    });

    it('matches case-insensitively', () => {
        expect(parseEntityName('FORMFIELD')).toBe('formField');
        expect(parseEntityName('media')).toBe('media');
    });

    it('returns undefined for backend types without an SDK entity', () => {
        // Tracked or untracked backend entities deliberately absent from ENTITY_NAMES.
        expect(parseEntityName('Document')).toBeUndefined();
        expect(parseEntityName('ApiKey')).toBeUndefined();
        expect(parseEntityName('Sheet')).toBeUndefined();
        expect(parseEntityName('')).toBeUndefined();
    });

    it('round-trips every declared EntityName', () => {
        for (const name of ENTITY_NAMES) {
            expect(parseEntityName(name)).toBe(name);
        }
    });
});
