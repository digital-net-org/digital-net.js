import type { FormFieldType } from '../../../../Dto';

export interface FormFieldPayload {
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
