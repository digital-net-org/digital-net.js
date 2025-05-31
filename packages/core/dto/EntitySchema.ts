export interface EntitySchemaProperty {
    name: string;
    path: string;
    type: string;
    dataFlag: string | null;
    isReadOnly: boolean;
    isSecret: boolean;
    isRequired: boolean;
    isUnique: boolean;
    maxLength?: number | null;
    isIdentity: boolean;
    isForeignKey: boolean;
    regexValidation: string | null;
}

export type EntitySchema = Array<EntitySchemaProperty>;
