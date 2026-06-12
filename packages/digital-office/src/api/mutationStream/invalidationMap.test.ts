import { describe, expect, it } from 'vitest';
import { resolveInvalidations } from './invalidationMap';
import type { MutationSignal } from '@digital-net-org/digital-api-sdk';
import type { Query } from '@tanstack/react-query';

function signal(entity: string, entityId = 'id-1'): MutationSignal {
    return { type: 'Updated', entity, entityId };
}

function fakeQuery(queryKey: readonly unknown[]): Query {
    return { queryKey } as unknown as Query;
}

describe('resolveInvalidations', () => {
    it.each([
        ['Article', 'cms/articles', 'article'],
        ['Page', 'cms/pages', 'page'],
        ['Media', 'cms/media', 'media'],
        ['Tag', 'cms/tags', 'tag'],
        ['Form', 'cms/forms', 'form'],
    ])('maps %s to its list prefix and its get key', (entity, listPath, getName) => {
        const filters = resolveInvalidations(signal(entity, 'abc'));

        expect(filters).toEqual([
            { queryKey: ['dn-entity-list', listPath] },
            { queryKey: ['dn-entity-get', getName, 'abc'] },
        ]);
    });

    it('maps FormField to the forms list only (the parent-touch covers the form detail)', () => {
        expect(resolveInvalidations(signal('FormField'))).toEqual([{ queryKey: ['dn-entity-list', 'cms/forms'] }]);
    });

    it('maps FormSubmission to its detail key and the submissions tabs of any form', () => {
        const filters = resolveInvalidations(signal('FormSubmission', 'sub-1'));

        expect(filters[0]).toEqual({ queryKey: ['dn-entity-get', 'formSubmission', 'sub-1'] });
        const predicate = filters[1].predicate!;
        expect(predicate(fakeQuery(['dn-entity-get', 'form', 'f1', 'submissions', 1, 25]))).toBe(true);
        expect(predicate(fakeQuery(['dn-entity-get', 'form', 'f1']))).toBe(false);
        expect(predicate(fakeQuery(['dn-entity-list', 'cms/forms']))).toBe(false);
    });

    it('maps User to the admin get key', () => {
        expect(resolveInvalidations(signal('User', 'u1'), 'someone-else')).toEqual([
            { queryKey: ['dn-entity-get', '/admin/user', 'u1'] },
        ]);
    });

    it('also invalidates the self user when the mutation targets the current user', () => {
        const filters = resolveInvalidations(signal('User', 'u1'), 'u1');

        expect(filters).toContainEqual({ queryKey: ['dn-user', 'self'] });
    });

    it('maps ConfigValue to the config-value prefix', () => {
        expect(resolveInvalidations(signal('ConfigValue'))).toEqual([{ queryKey: ['config-value'] }]);
    });

    it('ignores unmapped entities (Document, unknown types)', () => {
        expect(resolveInvalidations(signal('Document'))).toEqual([]);
        expect(resolveInvalidations(signal('SomethingNew'))).toEqual([]);
    });

    it('matches entity names case-insensitively', () => {
        expect(resolveInvalidations(signal('page', 'p1'))).toEqual([
            { queryKey: ['dn-entity-list', 'cms/pages'] },
            { queryKey: ['dn-entity-get', 'page', 'p1'] },
        ]);
    });
});
