import type { Entity } from './Entity';

export interface TagDto extends Entity {
    name: string;
    color?: string | null;
}
