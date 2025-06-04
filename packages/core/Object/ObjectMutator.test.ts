import { expect, test } from 'vitest';
import { ObjectMutator } from './ObjectMutator';

test('ObjectMutator: deleteUndefinedEntries(), Should delete entries from object with undefined value', () => {
    const obj = { key: undefined, definedKey: 'definedKey', sub: { key: undefined, definedKey: 'definedKey' } };
    const result = ObjectMutator.deleteUndefinedEntries(obj);

    expect(Object.keys(result)).not.toContain('key');
    expect(Object.keys(result)).toContain('definedKey');
    expect(Object.keys(result.sub)).not.toContain('key');
    expect(Object.keys(result.sub)).toContain('definedKey');
});
