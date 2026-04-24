import type { Entity } from './Entity';
import type { PageEntityType } from './PageEntityType';

export interface OpenGraphEntry {
    property: string;
    content: string;
}

export interface PageDto extends Entity {
    path: string;
    entityType?: PageEntityType;
    published: boolean;
    indexed: boolean;
    title?: string;
    description?: string;
    jsonLd?: string;
    openGraph?: OpenGraphEntry[];
    redirect?: string;
    createdAt: string;
    updatedAt?: string;
}
