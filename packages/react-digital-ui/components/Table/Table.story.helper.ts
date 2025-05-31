import { generateArray, StringRandomizer } from '@digital-net/core';
import type { Entity } from '@digital-net/core';

export interface TestEntity extends Entity {
    name: string;
}

export const testEntities: Array<TestEntity> = generateArray(55, () => ({
    id: StringRandomizer.randomGuid(),
    name: StringRandomizer.GenerateName(),
    createdAt: new Date(),
}));
