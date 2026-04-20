import * as React from 'react';
import { Stack } from '@mui/material';
import { type SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { DnEntityInput } from '../DnEntityInput';

export type EntityInputStaticProps = Record<string, { label: string; helperText: string }>;

export interface DnEntityFormProps {
    schemas: SchemaProperty[];
    staticProps: EntityInputStaticProps;
}

export function DnEntityForm({ schemas, staticProps }: DnEntityFormProps) {
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
            {resolvedSchemas.map(s => (
                <DnEntityInput key={s.schema.name} {...s} />
            ))}
        </Stack>
    );
}
