import type { Entity } from '../Entity';

export interface MediaVariantDto extends Entity {
    mediaId: string;
    width: number;
    height: number;
    quality: number;
    fileSize: number;
    mimeType: string;
}
