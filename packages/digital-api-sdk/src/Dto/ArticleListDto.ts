import type { Entity } from '../Entity';
import type { TagDto } from './TagDto';

export interface ArticleListDto extends Entity {
    title: string;
    slug: string;
    publishedAt?: string | null;
    pageId?: string | null;
    tags: TagDto[];
}
