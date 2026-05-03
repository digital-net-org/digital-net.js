import * as React from 'react';
import { Alert as MuiAlert, Autocomplete, IconButton, Skeleton, Stack, TextField } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { Add as AddIcon, DeleteOutlined as DeleteIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import type { OpenGraphEntry, PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../api';
import { useDnEntityFormContext, useOgSchema, useOgState } from '../../entity';
import { DnButton, DnExternalButton, DnLazyMount } from '../../ui';
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
    const { rows, canAdd, options, handleAdd, handleDelete, handlePropertyChange, handleContentChange } = useOgState(
        initialEntries,
        entries => setField('/openGraph', entries),
        resetSignal
    );
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
            <Body>
                {rows.map(row => (
                    <Stack key={row.id} direction="row" sx={{ gap: 1, alignItems: 'flex-start' }}>
                        <LazyMount flex={1}>
                            <Autocomplete
                                sx={{ flex: '0 0 38%' }}
                                size="small"
                                options={options.map(p => p.key)}
                                value={row.property || null}
                                onChange={(_, value) => handlePropertyChange(row.id, value ?? '')}
                                disabled={disabled}
                                autoHighlight
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        label="Property"
                                        size="small"
                                        required
                                        error={showErrors && row.property === ''}
                                        helperText={showErrors && row.property === '' ? 'Requis' : undefined}
                                    />
                                )}
                            />
                        </LazyMount>
                        <LazyMount flex={2}>
                            <TextField
                                sx={{ flex: 1 }}
                                size="small"
                                label="Content"
                                value={row.content}
                                onChange={e => handleContentChange(row.id, e.target.value)}
                                disabled={disabled}
                                required
                                error={showErrors && row.content === ''}
                                helperText={showErrors && row.content === '' ? 'Requis' : undefined}
                            />
                        </LazyMount>
                        <IconButton onClick={() => handleDelete(row.id)} disabled={disabled}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                ))}
            </Body>
        );
    };

    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <DnEntityTabHelper description="Définissez les métadonnées OpenGraph de votre page.">
                <DnExternalButton link={OG_DOC_URL}>Documentation</DnExternalButton>
                <DnButton icon={<AddIcon fontSize="small" />} onClick={handleAdd} disabled={disabled || !canAdd}>
                    Ajouter une propriété
                </DnButton>
            </DnEntityTabHelper>
            {renderBody()}
        </Stack>
    );
}

function LazyMount({ children, flex }: { children: React.ReactNode; flex: number }) {
    return (
        <DnLazyMount sx={{ minHeight: 48, flex }} placeholder={<Skeleton variant="rounded" height={48} />}>
            {children}
        </DnLazyMount>
    );
}

const Body = styled(Stack)(
    () => css`
        padding-top: 1rem;
        overflow-y: auto;
        gap: 1rem;
    `
);
