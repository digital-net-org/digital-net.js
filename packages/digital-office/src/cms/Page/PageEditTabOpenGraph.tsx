import * as React from 'react';
import { Alert as MuiAlert, Autocomplete, IconButton, Skeleton, Stack, TextField } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { Add as AddIcon, DeleteOutlined as DeleteIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext, useOgSchema, useOgState } from '../../entity';
import { DnButton } from '../../ui';

const OG_DOC_URL = 'https://ogp.me/';

export function PageEditTabOpenGraph() {
    const { values, setField, disabled, errors } = useDnEntityFormContext<PageDto>();
    const { rows, canAdd, handleAdd, handleDelete, handlePropertyChange, handleContentChange, optionsFor } = useOgState(
        values.openGraph,
        entries => setField('/openGraph', entries)
    );
    const { loading, error, reload } = useOgSchema();
    const showErrors = errors?.has('openGraph') ?? false;

    const renderBody = () => {
        if (loading) {
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
                        <Autocomplete
                            sx={{ flex: '0 0 38%' }}
                            size="small"
                            options={optionsFor(row).map(p => p.key)}
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
                        <IconButton aria-label="delete" onClick={() => handleDelete(row.id)} disabled={disabled}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                ))}
            </Body>
        );
    };

    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <Alert severity="info" variant="outlined">
                <Stack direction="row" sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack>Définissez les métadonnées OpenGraph de votre page.</Stack>
                    <Stack direction="row" sx={{ gap: 2 }}>
                        <ExternalButton link={OG_DOC_URL}>Documentation</ExternalButton>
                        <DnButton
                            icon={<AddIcon fontSize="small" />}
                            onClick={handleAdd}
                            disabled={disabled || !canAdd}
                        >
                            Ajouter une propriété
                        </DnButton>
                    </Stack>
                </Stack>
            </Alert>
            {renderBody()}
        </Stack>
    );
}

function ExternalButton({ link, children }: { link: string; children?: React.ReactNode }) {
    return (
        <DnButton
            variant="outlined"
            icon={<OpenInNewIcon fontSize="small" />}
            onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        >
            {children}
        </DnButton>
    );
}

const Body = styled(Stack)(
    () => css`
        padding-top: 1rem;
        overflow-y: auto;
        gap: 1rem;
    `
);

const Alert = styled(MuiAlert)(
    () => css`
        & .MuiAlert-message {
            width: 100%;
        }
        & .MuiAlert-icon {
            padding: 0;
            align-items: center;
        }
    `
);
