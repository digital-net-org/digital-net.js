import type { Entity } from '../Entity';

export interface PageListDto extends Entity {
    path: string;
    published: boolean;
    indexed: boolean;
    title?: string;
    redirect?: string;
}
