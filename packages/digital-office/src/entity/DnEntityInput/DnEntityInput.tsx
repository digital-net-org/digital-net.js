import * as React from 'react';
import { FormControl, FormControlLabel, FormHelperText, Divider } from '@mui/material';
import type { SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { DnInput, DnSwitch } from '../../ui';

export interface DnEntityInputProps {
    schema: SchemaProperty;
    value: any;
    onChange: (_value: any) => void;
    label?: string;
    helperText?: React.ReactNode;
    disabled?: boolean;
    multiline?: boolean;
    rows?: number;
}

export function DnEntityInput({
    schema,
    value,
    onChange,
    label,
    helperText,
    disabled,
    multiline,
    rows,
}: DnEntityInputProps) {
    const resolvedLabel = React.useMemo(() => label ?? schema.name, [label, schema]);
    const resolvedDisabled = React.useMemo(
        () => disabled || schema.isReadOnly || schema.isIdentity,
        [schema, disabled]
    );
    const resolvedInputProps = React.useMemo(
        () => ({
            label: resolvedLabel,
            value: value,
            disabled: resolvedDisabled,
            required: schema.isRequired,
            helperText: helperText,
        }),
        [helperText, resolvedDisabled, resolvedLabel, schema.isRequired, value]
    );

    const handleChange = (next: unknown) => onChange(next);

    switch (schema.type) {
        case 'Boolean':
            return (
                <FormControl>
                    <FormControlLabel
                        control={
                            <DnSwitch
                                checked={value ?? false}
                                disabled={resolvedDisabled}
                                onChange={(_, checked) => handleChange(checked)}
                            />
                        }
                        label={resolvedLabel}
                    />
                    {helperText !== undefined ? (
                        <React.Fragment>
                            <Divider sx={{ marginTop: 1 }} />
                            <FormHelperText>{helperText}</FormHelperText>
                        </React.Fragment>
                    ) : null}
                </FormControl>
            );
        case 'Int32':
        case 'Int64':
        case 'Double':
        case 'Decimal':
            return (
                <DnInput
                    type="number"
                    {...resolvedInputProps}
                    onChange={event => {
                        const raw = event.target.value;
                        handleChange(raw === '' ? Number.NaN : Number(raw));
                    }}
                />
            );
        case 'DateTime':
        case 'DateTimeOffset':
            return (
                <DnInput
                    type="datetime-local"
                    {...resolvedInputProps}
                    onChange={event => handleChange(event.target.value)}
                />
            );
        case 'Guid':
        case 'String':
        default:
            return (
                <DnInput
                    type="text"
                    {...resolvedInputProps}
                    multiline={multiline}
                    rows={rows}
                    max={schema.maxLength ?? undefined}
                    onChange={event => handleChange(event.target.value)}
                />
            );
    }
}
