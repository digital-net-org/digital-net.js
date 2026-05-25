import * as React from 'react';
import { Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { FormDto, FormFieldDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityTabHelper, useDnEntityFormContext } from '../../../entity';
import { DnButton, DnDraggableContext, DnLoadingView } from '../../../ui';
import { FormFieldRow } from './FormFieldRow';
import { useFieldsState } from './useFieldsState';
import { useFieldSchema } from './useFieldSchema';

export function FormTabFields() {
    const { values, apiData, setField, disabled, errors, resetSignal, registerSubValidator } =
        useDnEntityFormContext<FormDto>();
    const { schemas, loading: schemasLoading } = useFieldSchema();

    const initialFields = React.useMemo<FormFieldDto[] | undefined>(
        () => (values.fields as FormFieldDto[] | undefined) ?? apiData?.fields,
        [values.fields, apiData?.fields]
    );

    const state = useFieldsState(initialFields, entries => setField('/fields', entries), resetSignal, schemas);

    const showErrors = errors?.has('fields') ?? false;

    const validityRef = React.useRef({ isValid: state.isValid, schemasLoading });
    React.useEffect(() => {
        validityRef.current = { isValid: state.isValid, schemasLoading };
    }, [state.isValid, schemasLoading]);
    React.useEffect(() => {
        if (!registerSubValidator) return;
        return registerSubValidator('fields', () =>
            validityRef.current.schemasLoading || !validityRef.current.isValid ? new Set(['fields']) : new Set()
        );
    }, [registerSubValidator]);

    if (schemasLoading) return <DnLoadingView />;

    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <DnEntityTabHelper description="Définissez les champs de saisie de votre formulaire." />
            <DnDraggableContext onSort={state.handleReorder} rows={state.rows}>
                <Stack sx={{ gap: 1 }}>
                    {state.rows.map(row => (
                        <FormFieldRow
                            key={row.id}
                            row={row}
                            disabled={disabled ?? false}
                            showErrors={showErrors}
                            errors={state.rowErrors.get(row.id)}
                            onFieldChange={state.handleFieldChange}
                            onDelete={state.handleDelete}
                        />
                    ))}
                    <DnButton icon={<AddIcon fontSize="small" />} onClick={state.handleAdd} disabled={disabled}>
                        Ajouter un champ
                    </DnButton>
                </Stack>
            </DnDraggableContext>
        </Stack>
    );
}
