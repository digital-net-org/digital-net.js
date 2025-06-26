import type { Entity } from '../../Entity';

export interface PageMeta extends Entity {
    key: string;
    value: string;
    content: string;
    pageId: string;
}
