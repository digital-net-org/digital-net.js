import type { ArticlePublicListDto } from './ArticlePublicListDto';
import type { ArticlePublicMediaDto } from './ArticlePublicMediaDto';
import type { TagPublicDto } from './TagPublicDto';

export interface ArticlePublicDto {
    id: string;
    title: string;
    description: string;
    content: string;
    slug: string;
    publishedAt?: string | null;
    updatedAt?: string | null;
    tags: TagPublicDto[];
    medias: ArticlePublicMediaDto[];
    related: ArticlePublicListDto[];
}
