import type { Entity } from '../../Entity';

export interface PageLight extends Entity {
    title: string;
    path: string;
    version: string;
    isPublished: boolean;
}
