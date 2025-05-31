import type { Entity } from './Entity';

export interface EntityRaw extends Omit<Entity, 'updatedAt' | 'createdAt'> {
    createdAt: string | Date ;
    updatedAt: string | Date | null;
}
