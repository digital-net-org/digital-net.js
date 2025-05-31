import type { EntitySchema } from './EntitySchema';

export class EntitySchemaHelper {
    public static getFlag(schema: EntitySchema | undefined, flag: string) {
        return (schema ?? []).find(property => property.dataFlag === flag)?.name?.toLowerCase();
    }

    public static resolve(type: string) {
        if (type === 'String'
            || type === 'char') {
            return 'string';
        }
        if (type === 'Boolean'
            || type === 'bool') {
            return 'boolean';
        }
        if (type === 'DateTime') {
            return 'Date';
        }
        if (type === 'Number'
            || type === 'int'
            || type === 'long'
            || type === 'integer') {
            return 'number';
        } else return type;
    }
}
