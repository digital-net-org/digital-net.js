import type { Entity } from '../Entity';
import type { FormFieldType } from './FormFieldType';

export interface FormFieldDto extends Entity {
    formId: string;
    name: string;
    type: FormFieldType;
    label: string;
    placeholder?: string;
    defaultValue?: string;
    required: boolean;
    sortOrder: number;
    validationJson?: string;
    optionsJson?: string;
}
