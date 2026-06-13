import type { Entity } from '../Entity';
import type { MediaVariantDto } from './MediaVariantDto';

export interface MediaDto extends Entity {
    name: string;
    alt?: string | null;
    published: boolean;
    documentId: string;
    width?: number | null;
    height?: number | null;
    fileSize: number;
    mimeType: string;
    variants: MediaVariantDto[];
}
