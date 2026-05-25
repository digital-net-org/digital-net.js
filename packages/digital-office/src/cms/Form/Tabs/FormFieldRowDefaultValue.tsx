import { FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import { DnInput, DnSwitch } from '../../../ui';
import type { FieldChangeHandler, FieldRow } from './useFieldsState';

export interface FormFieldRowDefaultValueProps {
    row: FieldRow;
    disabled: boolean;
    validOptions: string[];
    onFieldChange: FieldChangeHandler;
}

export function FormFieldRowDefaultValue({
    row,
    disabled,
    validOptions,
    onFieldChange,
}: FormFieldRowDefaultValueProps) {
    if (['checkbox'].includes(row.type)) {
        return (
            <FormControlLabel
                sx={{ minWidth: 'unset' }}
                labelPlacement="start"
                control={
                    <DnSwitch
                        checked={row.defaultValue === 'true'}
                        onChange={(_, checked) => onFieldChange(row.id, 'defaultValue', checked ? 'true' : undefined)}
                        disabled={disabled}
                    />
                }
                label={<Typography variant="caption">Coché par défaut</Typography>}
            />
        );
    }
    if (['select', 'radio'].includes(row.type)) {
        const hasOptions = validOptions.length > 0;
        return (
            <TextField
                select
                label="Valeur par défaut"
                sx={{ minWidth: 300 }}
                value={hasOptions ? (row.defaultValue ?? '') : ''}
                onChange={event => onFieldChange(row.id, 'defaultValue', event.target.value || undefined)}
                disabled={disabled || !hasOptions}
                slotProps={{ inputLabel: { shrink: true }, select: { displayEmpty: true } }}
            >
                <MenuItem value="">
                    <em>Aucune</em>
                </MenuItem>
                {validOptions.map(option => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
        );
    }
    return (
        <DnInput
            label="Valeur par défaut"
            type={row.type === 'number' ? 'number' : 'text'}
            value={row.defaultValue ?? ''}
            onChange={event => onFieldChange(row.id, 'defaultValue', event.target.value || undefined)}
            disabled={disabled}
        />
    );
}
