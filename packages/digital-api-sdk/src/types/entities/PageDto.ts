import type { Entity } from './Entity';
import type { PageEntityType } from './PageEntityType';
import type { PageMedia } from './PageMedia';

export interface PageDto extends Entity {
    path: string;
    entityType?: PageEntityType;
    published: boolean;
    indexed: boolean;
    title?: string;
    description?: string;
    jsonLd?: string;
    redirect?: string;
    media: PageMedia[];
    createdAt: string;
    updatedAt?: string;
}
