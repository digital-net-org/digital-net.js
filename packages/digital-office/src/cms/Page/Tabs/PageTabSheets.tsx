import * as React from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import type { PageDto, PageSheet } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../../api';
import { useDnEntityFormContext } from '../../../entity';
import { DnButton, DnDraggableContext, DnLoadingView } from '../../../ui';
import { DN_QUERY_KEY_GET } from '../../../entity/DnQueryKeys';
import { DnEntityTabHelper } from '../../../entity/DnEntityTabHelper';
import { EditSheetRow } from './EditSheetRow';
import { useSheetsState } from './useSheetsState';

export function PageTabSheets() {
    const { values, setField, disabled, errors, resetSignal } = useDnEntityFormContext<PageDto>();
    const api = useDnApi();
    const pageId = values.id;
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
    const state = useSheetsState(seedSheets, next => setField('/sheets', next), resetSignal);
    const showErrors = errors?.has('sheets') ?? false;

    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <DnEntityTabHelper description="Attachez des feuilles CSS, JS ou HTML à votre page.">
                <DnButton icon={<AddIcon fontSize="small" />} onClick={state.handleAdd} disabled={disabled}>
                    Ajouter une feuille
                </DnButton>
            </DnEntityTabHelper>
            {isLoadingSheets ? (
                <DnLoadingView />
            ) : (
                <DnDraggableContext onSort={state.handleReorder} rows={state.rows}>
                    <Stack sx={{ gap: 1 }}>
                        {state.rows.map(row => (
                            <EditSheetRow
                                key={row.id}
                                row={row}
                                disabled={disabled ?? false}
                                showErrors={showErrors}
                                errors={state.rowErrors.get(row.id)}
                                onFieldChange={state.handleFieldChange}
                                onToggleExpand={state.handleToggleExpand}
                                onDelete={state.handleDelete}
                            />
                        ))}
                        {state.rows.length === 0 && (
                            <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                                Aucune feuille. Cliquez sur <em>Ajouter</em> pour en créer une.
                            </Typography>
                        )}
                    </Stack>
                </DnDraggableContext>
            )}
        </Stack>
    );
}
