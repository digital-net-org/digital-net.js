import type { Entity } from '../Entity';
import type { FormFieldDto } from './FormFieldDto';

export interface FormPublicDto extends Entity {
    name: string;
    description?: string | null;
    submitLabel: string;
    fields: FormFieldDto[];
}
