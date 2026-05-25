export const FORM_FIELD_TYPES = [
    'text',
    'textarea',
    'email',
    'number',
    'checkbox',
    'select',
    'radio',
    'message',
] as const;

export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];
