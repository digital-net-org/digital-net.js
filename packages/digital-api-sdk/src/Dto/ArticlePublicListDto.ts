import type { ArticlePublicMediaDto } from './ArticlePublicMediaDto';
import type { TagPublicDto } from './TagPublicDto';

export interface ArticlePublicListDto {
    id: string;
    title: string;
    description: string;
    slug: string;
    publishedAt?: string | null;
    updatedAt?: string | null;
    tags: TagPublicDto[];
    medias: ArticlePublicMediaDto[];
}
