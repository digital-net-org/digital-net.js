import * as React from 'react';
import { Stack } from '@mui/material';
import { type SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { DnEntityInput } from '../DnEntityInput';

export type EntityInputStaticProps = Record<string, { label: string; helperText: string }>;

export interface DnEntityFormProps {
    schemas: SchemaProperty[];
    staticProps: EntityInputStaticProps;
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

export function DnEntityForm({ schemas, staticProps, values, onFieldChange, errors, disabled }: DnEntityFormProps) {
    const resolvedSchemas = React.useMemo(
        () =>
            Object.entries(staticProps).reduce<(EntityInputStaticProps[string] & { schema: SchemaProperty })[]>(
                (acc, [key, value]) => {
                    const schema = schemas.find(({ name }) => name === key);
                    if (schema) {
                        acc.push({ ...value, schema });
                    }
                    return acc;
                },
                []
            ),
        [schemas, staticProps]
    );

    return (
        <Stack spacing={2} sx={{ maxWidth: 720 }}>
            {resolvedSchemas.map(s => {
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
                        error={errors?.has(accessor)}
                        disabled={disabled}
                    />
                );
            })}
        </Stack>
    );
}
