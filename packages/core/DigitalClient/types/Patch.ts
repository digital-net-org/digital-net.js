import type { Entity } from '../../Dto';

export interface PatchOperation<T = any> {
    op: 'replace' | 'add' | 'remove';
    path: string;
    value: T;
}

export interface StoredPatchOperation<T = any> extends Omit<Entity, 'createdAt' | 'updatedAt'>, PatchOperation<T> {}

export type Patch = Array<PatchOperation>;
