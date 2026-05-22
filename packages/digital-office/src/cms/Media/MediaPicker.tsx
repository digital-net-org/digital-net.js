import * as React from 'react';
import { Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import type { MediaDto, QueryResult } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../api';
import { DN_QUERY_KEY_LIST } from '../../entity';
import { DnButton, DnInputAutocomplete } from '../../ui';
import { MediaPreview } from './MediaPreview';

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

export interface MediaPickerProps {
    value: MediaDto | null;
    label?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    onChange: (_media: MediaDto | null) => void;
}

export function MediaPicker({ value, label, disabled, error, helperText, onChange }: MediaPickerProps) {
    const api = useDnApi();
    const [inputText, setInputText] = React.useState('');
    const [search, setSearch] = React.useState('');
    const [size, setSize] = React.useState(PAGE_SIZE);

    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    React.useEffect(
        () => () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        },
        []
    );

    const handleInputChange = React.useCallback((_: unknown, next: string) => {
        setInputText(next);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setSearch(next.trim()), SEARCH_DEBOUNCE_MS);
    }, []);

    const {
        data: pageResult,
        isLoading,
        isFetching,
    } = useQuery<QueryResult<MediaDto>>({
        queryKey: [DN_QUERY_KEY_LIST, 'cms/media', { name: search, size }],
        queryFn: async () => {
            const params: Record<string, unknown> = { size, index: 1 };
            if (search) params.name = search;
            const response = await api.http.request<QueryResult<MediaDto>>({ path: 'cms/media', params });
            return response.data;
        },
    });

    const allOptions = React.useMemo(() => pageResult?.value ?? [], [pageResult]);
    const optionsWithValue = React.useMemo(() => {
        if (!value || allOptions.some(m => m.id === value.id)) return allOptions;
        return [value, ...allOptions];
    }, [allOptions, value]);

    const hasMore = pageResult ? allOptions.length < pageResult.total : false;

    return (
        <Stack direction="row" sx={{ gap: 2, alignItems: 'flex-start', width: '100%' }}>
            <Stack
                sx={theme => ({
                    flex: 1,
                    minWidth: 100,
                    minHeight: 75,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    border: `1px ${value ? 'solid' : 'dashed'}`,
                    borderColor: theme.palette.divider,
                    borderRadius: 1,
                })}
            >
                {value ? <MediaPreview mediaId={value.id} variant="list" /> : null}
            </Stack>
            <Stack spacing={1} sx={{ flex: 8, gap: 2.5 }}>
                <DnInputAutocomplete
                    label={label ?? 'Média'}
                    placeholder="Rechercher un média…"
                    noOptionsText="Aucune ressource"
                    loadingText="Chargement…"
                    error={error}
                    helperText={helperText}
                    disabled={disabled}
                    value={value}
                    options={optionsWithValue}
                    loading={isLoading}
                    inputValue={inputText}
                    onInputChange={handleInputChange}
                    onChange={next => onChange(next ?? null)}
                    getOptionLabel={m => m.name}
                    isOptionEqualToValue={(a, b) => a.id === b.id}
                    filterOptions={x => x}
                    renderListAction={
                        hasMore ? (
                            <DnButton
                                variant="outlined"
                                size="small"
                                loading={isFetching}
                                onClick={() => setSize(s => s + PAGE_SIZE)}
                            >
                                Charger plus ({allOptions.length}/{pageResult?.total ?? 0})
                            </DnButton>
                        ) : undefined
                    }
                />
            </Stack>
        </Stack>
    );
}
