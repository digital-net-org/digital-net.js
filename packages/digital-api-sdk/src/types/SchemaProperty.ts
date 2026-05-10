export type SchemaValueType =
    | 'String'
    | 'Int32'
    | 'Int64'
    | 'Double'
    | 'Decimal'
    | 'Boolean'
    | 'DateTime'
    | 'DateTimeOffset'
    | 'Guid'
    | 'Enum';

export interface SchemaProperty {
    name: string;
    path: string;
    type: SchemaValueType;
    isReadOnly: boolean;
    isSecret: boolean;
    isRequired: boolean;
    isUnique: boolean;
    isTemplatable: boolean;
    maxLength: number | null;
    isIdentity: boolean;
    isForeignKey: boolean;
    regexValidation: string | null;
    enumValues: string[] | null;
    oneOfValues: string[] | null;
}
