import * as React from 'react';
import { Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { PageDto, PageSheet } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext, useEntitySchema, DN_QUERY_KEY_GET, DnEntityTabHelper } from '../../../entity';
import { useDigitalNetApi } from '../../../api';
import { DnDraggableList, DnLoadingView } from '../../../ui';
import { EditSheetRow } from './EditSheetRow';
import { useSheetsState } from './useSheetsState';

export function PageTabSheets() {
    const { values, setField, disabled, errors, resetSignal, registerSubValidator } = useDnEntityFormContext<PageDto>();
    const api = useDigitalNetApi();
    const pageId = values.id;

    const { schemas: sheetSchemas, loading: sheetSchemaLoading } = useEntitySchema('pageSheet');
    const { data: initialSheets, isLoading: isLoadingSheets } = useQuery<PageSheet[] | undefined>({
        queryKey: [DN_QUERY_KEY_GET, 'page', pageId, 'sheets'],
        queryFn: async () => {
            const result = await api.catalog.page.getSheetsForEdit(pageId!);
            if (result.hasError) {
                throw new Error(result.errors?.[0]?.message ?? 'Failed to fetch sheets');
            }
            return result.value;
        },
        enabled: !!pageId,
        retry: false,
    });

    const draftSheets = (values as { sheets?: PageSheet[] }).sheets;
    const seedSheets = React.useMemo(() => draftSheets ?? initialSheets, [draftSheets, initialSheets]);
    const state = useSheetsState(seedSheets, next => setField('/sheets', next), resetSignal, sheetSchemas);

    const showErrors = errors?.has('sheets') ?? false;

    const validityRef = React.useRef({ isValid: state.isValid, schemaLoading: sheetSchemaLoading });
    React.useEffect(() => {
        validityRef.current = { isValid: state.isValid, schemaLoading: sheetSchemaLoading };
    }, [state.isValid, sheetSchemaLoading]);
    React.useEffect(() => {
        if (!registerSubValidator) return;
        return registerSubValidator('sheets', () =>
            validityRef.current.schemaLoading || !validityRef.current.isValid ? new Set(['sheets']) : new Set()
        );
    }, [registerSubValidator]);

    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <DnEntityTabHelper description="Attachez des feuilles CSS, JS ou HTML à votre page." />
            {isLoadingSheets ? (
                <DnLoadingView />
            ) : (
                <DnDraggableList
                    rows={state.rows}
                    onSort={state.handleReorder}
                    onCreate={state.handleAdd}
                    disabled={disabled}
                    renderRow={row => (
                        <EditSheetRow
                            row={row}
                            disabled={disabled ?? false}
                            showErrors={showErrors}
                            errors={state.rowErrors.get(row.id)}
                            onFieldChange={state.handleFieldChange}
                            onToggleExpand={state.handleToggleExpand}
                            onDelete={state.handleDelete}
                        />
                    )}
                />
            )}
        </Stack>
    );
}
