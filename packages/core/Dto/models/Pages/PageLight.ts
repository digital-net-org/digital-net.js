import type { Entity } from '../../Entity';

export interface PageLight extends Entity {
    title: string;
    path: string;
    isPublished: boolean;
}
