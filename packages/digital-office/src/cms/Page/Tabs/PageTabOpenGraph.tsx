import * as React from 'react';
import { Alert as MuiAlert, Stack, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import type { OpenGraphEntry, PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../../api';
import { useDnEntityFormContext, useEntitySchema } from '../../../entity';
import { DnButton, DnDraggableContext, DnExternalButton, DnLoadingView } from '../../../ui';
import { DN_QUERY_KEY_GET } from '../../../entity/DnQueryKeys';
import { DnEntityTabHelper } from '../../../entity/DnEntityTabHelper';
import { useOgState } from './useOgState';
import { useOgSchema } from './useOgSchema';
import { EditOpenGraphRow } from './EditOpenGraphRow';

const OG_DOC_URL = 'https://ogp.me/';

export function PageTabOpenGraph() {
    const { values, setField, disabled, errors, resetSignal, registerSubValidator } =
        useDnEntityFormContext<PageDto>();
    const api = useDnApi();
    const pageId = values.id;
    const { schemas: ogEntrySchemas, loading: ogEntrySchemaLoading } = useEntitySchema('openGraphEntry');
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
    const state = useOgState(
        seedEntries,
        entries => setField('/openGraph', entries),
        resetSignal,
        ogEntrySchemas
    );
    const { loading: loadingSchema, error, reload } = useOgSchema();
    const showErrors = errors?.has('openGraph') ?? false;

    const validityRef = React.useRef({ isValid: state.isValid, schemaLoading: ogEntrySchemaLoading });
    React.useEffect(() => {
        validityRef.current = { isValid: state.isValid, schemaLoading: ogEntrySchemaLoading };
    }, [state.isValid, ogEntrySchemaLoading]);
    React.useEffect(() => {
        if (!registerSubValidator) return;
        return registerSubValidator('openGraph', () =>
            validityRef.current.schemaLoading || !validityRef.current.isValid
                ? new Set(['openGraph'])
                : new Set()
        );
    }, [registerSubValidator]);

    const renderBody = () => {
        if (loadingSchema || isLoadingEntries) {
            return <DnLoadingView />;
        }
        if (error) {
            return (
                <MuiAlert severity="error" action={<DnButton onClick={reload}>Réessayer</DnButton>}>
                    Impossible de charger les schemas OpenGraph. Si le problème persiste, contactez votre
                    administrateur.
                </MuiAlert>
            );
        }
        return (
            <DnDraggableContext onSort={state.handleReorder} rows={state.rows}>
                <Stack sx={{ gap: 1 }}>
                    {state.rows.map(row => (
                        <EditOpenGraphRow
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
