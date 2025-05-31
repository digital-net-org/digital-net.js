import type { Entity, EntitySchema } from '@digital-net/core';

export interface TestEntity extends Entity {
    name: string;
    isBoolean: boolean;
}

export const testEntity: TestEntity = {
    id: 'xxxx-xxxx-xxxx-xxxx',
    name: 'defaultName',
    isBoolean: false,
    createdAt: new Date(),
};

export const testSchema: EntitySchema = [
    {
        name: 'Name',
        path: 'Name',
        type: 'String',
        isReadOnly: false,
        isSecret: false,
        isRequired: true,
        isUnique: true,
        maxLength: 1024,
        isIdentity: false,
        isForeignKey: false,
        dataFlag: null,
        regexValidation: null,
    },
    {
        name: 'IsBoolean',
        path: 'IsBoolean',
        type: 'Boolean',
        dataFlag: null,
        isReadOnly: false,
        isSecret: false,
        isRequired: true,
        isUnique: false,
        maxLength: null,
        isIdentity: false,
        isForeignKey: false,
        regexValidation: null,
    },
    {
        name: 'Id',
        path: 'Id',
        type: 'Guid',
        dataFlag: null,
        isReadOnly: false,
        isSecret: false,
        isRequired: false,
        isUnique: false,
        maxLength: null,
        isIdentity: true,
        isForeignKey: false,
        regexValidation: null,
    },
    {
        name: 'CreatedAt',
        path: 'CreatedAt',
        type: 'DateTime',
        dataFlag: null,
        isReadOnly: true,
        isSecret: false,
        isRequired: true,
        isUnique: false,
        maxLength: null,
        isIdentity: false,
        isForeignKey: false,
        regexValidation: null,
    },
    {
        name: 'UpdatedAt',
        path: 'UpdatedAt',
        type: 'DateTime',
        dataFlag: null,
        isReadOnly: true,
        isSecret: false,
        isRequired: false,
        isUnique: false,
        maxLength: null,
        isIdentity: false,
        isForeignKey: false,
        regexValidation: null,
    },
];
