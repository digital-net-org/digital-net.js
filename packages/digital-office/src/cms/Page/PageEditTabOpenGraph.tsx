import * as React from 'react';
import { Alert as MuiAlert, Skeleton, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import type { OpenGraphEntry, OpenGraphPropertySchema, PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../api';
import { useDnEntityFormContext, useOgSchema, useOgState, type OgRow } from '../../entity';
import { DnButton, DnDraggableContext, DnDraggableRow, DnExternalButton, DnInput, DnInputAutocomplete } from '../../ui';
import { DN_QUERY_KEY_GET } from '../../entity/DnQueryKeys';
import { DnEntityTabHelper } from '../../entity/DnEntityTabHelper';

const OG_DOC_URL = 'https://ogp.me/';

export function PageEditTabOpenGraph() {
    const { values, setField, disabled, errors, resetSignal } = useDnEntityFormContext<PageDto>();
    const api = useDnApi();
    const pageId = values.id;
    const { data: initialEntries, isLoading: isLoadingEntries } = useQuery<OpenGraphEntry[] | undefined>({
        queryKey: [DN_QUERY_KEY_GET, 'page', pageId, 'openGraph'],
        queryFn: async () => {
            const result = await api.catalog.page.getOpenGraphForEdit(pageId!);
            if (result.hasError) {
                throw new Error(result.errors?.[0]?.message ?? 'Failed to fetch openGraph');
            }
            return result.value;
        },
        enabled: !!pageId,
        retry: false,
    });
    const draftEntries = (values as { openGraph?: OpenGraphEntry[] }).openGraph;
    const seedEntries = React.useMemo(() => draftEntries ?? initialEntries, [draftEntries, initialEntries]);
    const state = useOgState(seedEntries, entries => setField('/openGraph', entries), resetSignal);
    const { loading: loadingSchema, error, reload } = useOgSchema();
    const showErrors = errors?.has('openGraph') ?? false;

    const renderBody = () => {
        if (loadingSchema || (isLoadingEntries && !!pageId)) {
            return (
                <Stack sx={{ gap: 1 }}>
                    <Skeleton variant="rectangular" height={48} />
                    <Skeleton variant="rectangular" height={48} />
                </Stack>
            );
        }
        if (error) {
            return (
                <MuiAlert severity="error" action={<DnButton onClick={reload}>Réessayer</DnButton>}>
                    {error.message}
                </MuiAlert>
            );
        }
        return (
            <DnDraggableContext onSort={state.handleReorder} rows={state.rows}>
                <Stack sx={{ gap: 1 }}>
                    {state.rows.map(row => (
                        <OpenGraphEditRow
                            key={row.id}
                            row={row}
                            disabled={disabled ?? false}
                            showErrors={showErrors}
                            errors={state.rowErrors.get(row.id)}
                            options={state.options}
                            onPropertyChange={state.handlePropertyChange}
                            onContentChange={state.handleContentChange}
                            onDelete={state.handleDelete}
                        />
                    ))}
                    {state.rows.length === 0 && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                            Aucune propriété. Cliquez sur <em>Ajouter</em> pour en créer une.
                        </Typography>
                    )}
                </Stack>
            </DnDraggableContext>
        );
    };

    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <DnEntityTabHelper description="Définissez les métadonnées OpenGraph de votre page.">
                <DnExternalButton link={OG_DOC_URL}>Documentation</DnExternalButton>
                <DnButton
                    icon={<AddIcon fontSize="small" />}
                    onClick={state.handleAdd}
                    disabled={disabled || !state.canAdd}
                >
                    Ajouter une propriété
                </DnButton>
            </DnEntityTabHelper>
            {renderBody()}
        </Stack>
    );
}

interface OpenGraphEditRowProps {
    row: OgRow;
    disabled: boolean;
    showErrors: boolean;
    errors: Set<'property' | 'content'> | undefined;
    options: OpenGraphPropertySchema[];
    onPropertyChange: (_id: string, _property: string) => void;
    onContentChange: (_id: string, _content: string) => void;
    onDelete: (_id: string) => void;
}

function OpenGraphEditRow({
    row,
    disabled,
    showErrors,
    errors,
    options,
    onPropertyChange,
    onContentChange,
    onDelete,
}: OpenGraphEditRowProps) {
    const propertyError = showErrors && (errors?.has('property') ?? false);
    const contentError = showErrors && (errors?.has('content') ?? false);

    return (
        <DnDraggableRow id={row.id} disabled={disabled} onDelete={onDelete}>
            <Stack direction="row" sx={{ gap: 1, alignItems: 'flex-start', width: '100%' }}>
                <Stack sx={{ flex: 1 }}>
                    <DnInputAutocomplete
                        label="Property"
                        options={options.map(p => p.key)}
                        value={row.property}
                        onChange={value => onPropertyChange(row.id, value)}
                        disabled={disabled}
                        required
                        error={propertyError}
                        helperText={propertyError ? 'Requis' : undefined}
                    />
                </Stack>
                <Stack sx={{ flex: 3 }}>
                    <DnInput
                        label="Content"
                        value={row.content}
                        onChange={e => onContentChange(row.id, e.target.value)}
                        disabled={disabled}
                        required
                        error={contentError}
                        helperText={contentError ? 'Requis' : undefined}
                    />
                </Stack>
            </Stack>
        </DnDraggableRow>
    );
}
