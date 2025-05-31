import { expect, test } from 'vitest';
import { EntityHelper } from './EntityHelper';
import type { Entity } from './Entity';

test('EntityHelper: build(), Should build the entity correctly from the json object.', () => {
    const jsonObject = EntityHelper.build({ id: 1, createdAt: '2021-10-01T00:00:00.000Z', updatedAt: null });
    expect(jsonObject).toEqual({ id: 1, createdAt: new Date('2021-10-01T00:00:00.000Z'), updatedAt: undefined });
});

test('EntityHelper: getLatest(), Should return the most recently created entity.', () => {
    const entities: Entity[] = [
        { id: 1, createdAt: new Date('2021-10-01T00:00:00.000Z') },
        { id: 2, createdAt: new Date('2021-10-02T00:00:00.000Z') },
        { id: 3, createdAt: new Date('2021-10-03T00:00:00.000Z') },
    ];
    expect(EntityHelper.getLatest(entities)).toEqual({ id: 3, createdAt: new Date('2021-10-03T00:00:00.000Z') });
});

test('EntityHelper: getById(), Should return the entity with the given ID.', () => {
    const entities: Entity[] = [
        { id: 1, createdAt: new Date('2021-10-01T00:00:00.000Z') },
        { id: 2, createdAt: new Date('2021-10-02T00:00:00.000Z') },
        { id: 3, createdAt: new Date('2021-10-03T00:00:00.000Z') },
    ];
    expect(EntityHelper.getById(entities, 2)).toEqual({ id: 2, createdAt: new Date('2021-10-02T00:00:00.000Z') });
});
