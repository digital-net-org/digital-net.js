import * as React from 'react';
import {
    Box,
    Collapse,
    FormControlLabel,
    MenuItem,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import type { PageDto, PageSheet, SheetType } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../api';
import { useDnEntityFormContext, useSheetsState, type SheetRow } from '../../entity';
import {
    DnButton,
    DnCodeEditor,
    DnDraggableContext,
    DnDraggableRow,
    DnExpandButton,
    DnInput,
    DnSwitch,
} from '../../ui';
import { DN_QUERY_KEY_GET } from '../../entity/DnQueryKeys';
import { DnEntityTabHelper } from '../../entity/DnEntityTabHelper';

const LANGUAGE_TYPES = { css: 'css', js: 'javascript', html: 'html' } as const;
const LANGUAGE_TYPES_MAP = Object.keys(LANGUAGE_TYPES) as (keyof typeof LANGUAGE_TYPES)[];

export function PageEditTabSheets() {
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
    const seedSheets = React.useMemo(
        () => draftSheets ?? initialSheets,
        [draftSheets, initialSheets]
    );
    const state = useSheetsState(seedSheets, next => setField('/sheets', next), resetSignal);
    const showErrors = errors?.has('sheets') ?? false;

    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <DnEntityTabHelper description="Attachez des feuilles CSS, JS ou HTML à votre page.">
                <DnButton icon={<AddIcon fontSize="small" />} onClick={state.handleAdd} disabled={disabled}>
                    Ajouter une feuille
                </DnButton>
            </DnEntityTabHelper>
            {isLoadingSheets && pageId ? (
                <Stack sx={{ gap: 1 }}>
                    <Skeleton variant="rectangular" height={56} />
                    <Skeleton variant="rectangular" height={56} />
                </Stack>
            ) : (
                <DnDraggableContext onSort={state.handleReorder} rows={state.rows}>
                    <Stack sx={{ gap: 1 }}>
                        {state.rows.map(row => (
                            <SheetEditRow
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

interface SheetEditRowProps {
    row: SheetRow;
    disabled: boolean;
    showErrors: boolean;
    errors: Set<'name' | 'type' | 'content' | 'published'> | undefined;
    onFieldChange: <K extends 'name' | 'type' | 'content' | 'published'>(
        _rowId: string,
        _field: K,
        _value: SheetRow[K]
    ) => void;
    onToggleExpand: (_rowId: string) => void;
    onDelete: (_rowId: string) => void;
}

function SheetEditRow({
    row,
    disabled,
    showErrors,
    errors,
    onFieldChange,
    onToggleExpand,
    onDelete,
}: SheetEditRowProps) {
    const nameError = showErrors && (errors?.has('name') ?? false);
    const contentError = showErrors && (errors?.has('content') ?? false);

    return (
        <DnDraggableRow id={row.id} disabled={disabled} onDelete={onDelete}>
            <Header>
                <DnInput
                    label="Nom"
                    value={row.name}
                    onChange={e => onFieldChange(row.id, 'name', e.target.value)}
                    disabled={disabled}
                    required
                    error={nameError}
                    helperText={nameError ? 'Requis' : undefined}
                    sx={{ flex: 2 }}
                />
                <TextField
                    select
                    value={row.type}
                    onChange={e => onFieldChange(row.id, 'type', e.target.value as SheetType)}
                    disabled={disabled}
                    sx={{ minWidth: 120 }}
                    slotProps={{
                        inputLabel: { shrink: true },
                        select: { displayEmpty: true, sx: { maxHeight: 28 } },
                    }}
                >
                    {LANGUAGE_TYPES_MAP.map(x => (
                        <MenuItem key={x} value={x}>
                            {x.toUpperCase()}
                        </MenuItem>
                    ))}
                </TextField>
                <Stack>
                    <FormControlLabel
                        sx={{
                            display: 'flex',
                            minWidth: 0,
                        }}
                        control={
                            <DnSwitch
                                checked={row.published}
                                onChange={(_, checked) => onFieldChange(row.id, 'published', checked)}
                                disabled={disabled}
                            />
                        }
                        label="Publié"
                    />
                </Stack>
                <DnExpandButton onClick={() => onToggleExpand(row.id)} expanded={row.expanded} />
            </Header>
            <Collapse in={row.expanded} unmountOnExit>
                <Box sx={{ height: 320, marginTop: 1 }}>
                    <DnCodeEditor
                        value={row.content}
                        onChange={value => onFieldChange(row.id, 'content', value)}
                        language={LANGUAGE_TYPES[row.type]}
                        disabled={disabled}
                    />
                    {contentError && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            Le contenu est requis.
                        </Typography>
                    )}
                </Box>
            </Collapse>
        </DnDraggableRow>
    );
}

const Header = styled(Stack)(
    ({ theme }) => css`
        flex-direction: row;
        align-items: center;
        gap: ${theme.spacing(1)};
    `
);
