import type { Entity } from '../../Entity';

export interface PageAssetLight extends Entity {
    path: string;
    mimeType: string;
}
