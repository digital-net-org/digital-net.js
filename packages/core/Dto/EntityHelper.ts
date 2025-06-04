import { DateBuilder } from '../Date';
import type { Patch } from '../DigitalClient';
import type { Entity } from './Entity';
import type { EntityRaw } from './EntityRaw';

/**
 * Helper class for **Entity**.
 */
export class EntityHelper {
    /**
     * Builds an entity from a json object.
     * @param entity The entity to build.
     * @returns The built entity.
     */
    public static build<T extends Entity>(entity: EntityRaw): T {
        return {
            ...entity,
            createdAt: DateBuilder.build(entity.createdAt),
            updatedAt: entity.updatedAt ? DateBuilder.build(entity.updatedAt) : undefined,
        } as T;
    }

    public static buildPatch<T extends Entity>(patch: Partial<T>): Patch<T> {
        delete patch.id;
        delete patch.createdAt;
        delete patch.updatedAt;

        return Object.keys(patch).map(key => ({
            op: 'replace',
            path: `/${key}`,
            value: patch[key as unknown as keyof T],
        }));
    }

    /**
     * Gets the most recently created entity from a list of entities.
     * @param entities The entities to search.
     * @param key The key to compare the entities by (default to 'createdAt').
     * @returns The most recently created entity.
     */
    public static getLatest<T extends Entity>(entities: T[], key?: 'updatedAt' | 'createdAt'): T | undefined {
        return entities.find(
            entity => entity[key ?? 'createdAt']?.getTime() === Math.max(...entities.map(e => e.createdAt.getTime()))
        );
    }

    /**
     * Gets an entity by its ID.
     * @param entities The entities to search.
     * @param id The ID of the entity to find.
     * @returns The entity with the given ID.
     */
    public static getById<T extends Entity>(entities: T[], id: string | number | undefined): T | undefined {
        return entities.find(entity => String(entity.id) === String(id));
    }
}
