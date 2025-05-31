import type { Entity } from '../../Entity';

export interface Avatar extends Entity {
    documentId: string;
    posX: number;
    posY: number;
}
