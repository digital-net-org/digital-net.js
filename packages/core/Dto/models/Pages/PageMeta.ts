import type { Entity } from '../../Entity';

export interface PageMeta extends Entity {
    name?: string;
    property?: string;
    content: string;
}
