import { type Entity, ArrayBuilder, StringRandomizer } from '@digital-net/core';

export interface TestEntity extends Entity {
    name: string;
}

export const testEntities: Array<TestEntity> = ArrayBuilder.build(55, () => ({
    id: StringRandomizer.randomGuid(),
    name: StringRandomizer.GenerateName(),
    createdAt: new Date(),
}));
