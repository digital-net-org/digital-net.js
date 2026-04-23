import * as React from 'react';
import { Stack } from '@mui/material';
import { type SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { DnEntityInput } from '../DnEntityInput';

export interface EntityInputFieldProps {
    label: string;
    helperText?: React.ReactNode;
    disabled?: boolean;
    error?: boolean;
    render?: React.ReactNode;
}

export interface DnEntityFormProps {
    schemas: SchemaProperty[];
    fieldProps: Record<string, EntityInputFieldProps>;
    values: Record<string, unknown>;
    onFieldChange: (_path: string, _value: unknown) => void;
    errors?: ReadonlySet<string>;
    disabled?: boolean;
}

function schemaNameToPath(name: string): string {
    return `/${name.charAt(0).toLowerCase()}${name.slice(1)}`;
}

function schemaNameToAccessor(name: string): string {
    return `${name.charAt(0).toLowerCase()}${name.slice(1)}`;
}

export function DnEntityForm({ schemas, fieldProps, values, onFieldChange, errors, disabled }: DnEntityFormProps) {
    const resolvedSchemas = React.useMemo(
        () =>
            Object.entries(fieldProps).reduce<(EntityInputFieldProps & { schema: SchemaProperty })[]>(
                (acc, [key, value]) => {
                    const schema = schemas.find(({ name }) => name === key);
                    if (schema) {
                        acc.push({ ...value, schema });
                    }
                    return acc;
                },
                []
            ),
        [schemas, fieldProps]
    );

    return (
        <Stack spacing={2} sx={{ maxWidth: 720 }}>
            {resolvedSchemas.map(s => {
                if (s.render !== undefined) {
                    return <React.Fragment key={s.schema.name}>{s.render}</React.Fragment>;
                }
                const accessor = schemaNameToAccessor(s.schema.name);
                const path = schemaNameToPath(s.schema.name);
                return (
                    <DnEntityInput
                        key={s.schema.name}
                        schema={s.schema}
                        label={s.label}
                        helperText={s.helperText}
                        value={values[accessor]}
                        onChange={next => onFieldChange(path, next)}
                        error={s.error ?? errors?.has(accessor)}
                        disabled={disabled || s.disabled}
                    />
                );
            })}
        </Stack>
    );
}
