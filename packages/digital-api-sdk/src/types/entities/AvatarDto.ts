import type { Entity } from './Entity';

export interface AvatarDto extends Entity {
    documentId: string;
    x: number;
    y: number;
}
