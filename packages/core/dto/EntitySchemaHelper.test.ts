import { expect, test } from 'vitest';
import { EntitySchemaHelper } from './EntitySchemaHelper';

test('EntitySchemaHelper.resolve, Should return Javascript type based on Schema types', () => {
    expect(EntitySchemaHelper.resolve('String')).toBe('string');
    expect(EntitySchemaHelper.resolve('bool')).toBe('boolean');
    expect(EntitySchemaHelper.resolve('DateTime')).toBe('Date');
});

test('EntitySchemaHelper.resolve, Should return the param unchanged if no matching types', () => {
    expect(EntitySchemaHelper.resolve('blabla')).toBe('blabla');
});
