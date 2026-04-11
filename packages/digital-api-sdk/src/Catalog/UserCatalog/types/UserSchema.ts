export interface UserSchemaProperty {
    name: string;
    type: string;
    isReadOnly?: boolean;
    isRequired?: boolean;
    [key: string]: unknown;
}
