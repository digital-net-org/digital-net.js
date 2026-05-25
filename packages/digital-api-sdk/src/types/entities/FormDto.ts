import type { Entity } from './Entity';
import type { FormFieldDto } from './FormFieldDto';

export interface FormDto extends Entity {
    name: string;
    description?: string;
    published: boolean;
    submitLabel: string;
    path?: string;
    fields: FormFieldDto[];
}
