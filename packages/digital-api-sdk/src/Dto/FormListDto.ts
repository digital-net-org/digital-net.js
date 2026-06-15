import type { Entity } from '../Entity';

export interface FormListDto extends Entity {
    name: string;
    published: boolean;
    path?: string;
}
