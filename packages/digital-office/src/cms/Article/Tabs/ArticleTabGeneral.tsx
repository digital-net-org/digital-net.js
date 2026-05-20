import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Chip, Stack, Typography } from '@mui/material';
import type { ArticleDto, PageDto, QueryResult } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../../api';
import {
    DN_QUERY_KEY_LIST,
    DnEntityForm,
    type DnEntityFormProps,
    useDnEntityFormContext,
    useEntitySchema,
} from '../../../entity';
import { DnButton, DnInputAutocomplete } from '../../../ui';

const fieldProps: DnEntityFormProps['fieldProps'] = {
    Title: {
        label: 'Titre',
        helperText: "Titre éditorial de l'article, affiché dans les listings et utilisé pour le rendu.",
    },
    Description: {
        label: 'Description',
        helperText: 'Description courte (peut être utilisée par la page-template).',
    },
    Slug: {
        label: 'Slug',
        helperText: 'Segment d\'URL public de l\'article (ex: "mon-article").',
    },
    PublishedAt: {
        label: 'Publié le',
        helperText: "Date de publication. Si vide, l'article reste en brouillon (non atteignable publiquement).",
    },
};

const INTERPOLABLE_PAGES_PAGE_SIZE = 10;

export function ArticleTabGeneral() {
    const api = useDnApi();
    const { schemas } = useEntitySchema('article');
    const { values, setField, errors, disabled } = useDnEntityFormContext<ArticleDto>();

    const [pagesSize, setPagesSize] = React.useState(INTERPOLABLE_PAGES_PAGE_SIZE);

    const {
        data: pagesResult,
        isLoading: pagesLoading,
        isFetching: pagesFetching,
    } = useQuery<QueryResult<PageDto>>({
        queryKey: [DN_QUERY_KEY_LIST, 'cms/pages', { entityType: 'Article', size: pagesSize }],
        queryFn: async () => {
            const result = await api.http.request<QueryResult<PageDto>>({
                path: 'cms/pages',
                params: { size: pagesSize, index: 1, entityType: 'Article' },
            });
            return result.data;
        },
    });

    const pages = React.useMemo(() => pagesResult?.value ?? [], [pagesResult]);
    const selectedPage = pages.find(p => p.id === values.pageId) ?? null;
    const hasMorePages = pagesResult ? pages.length < pagesResult.total : false;

    return (
        <Stack spacing={2} sx={{ maxWidth: 720 }}>
            <DnEntityForm
                schemas={schemas}
                fieldProps={fieldProps}
                values={values as Record<string, unknown>}
                onFieldChange={setField}
                errors={errors}
                disabled={disabled}
            />

            <DnInputAutocomplete
                label="Page associée"
                helperText={'Page qui servira l\'article (doit être de type "Article").'}
                value={selectedPage}
                options={pages}
                loading={pagesLoading}
                getOptionLabel={p => p.path}
                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                onChange={page => setField('/pageId', page?.id ?? null)}
                disabled={disabled}
                renderListAction={
                    hasMorePages ? (
                        <DnButton
                            variant="outlined"
                            size="small"
                            loading={pagesFetching}
                            onClick={() => setPagesSize(size => size + INTERPOLABLE_PAGES_PAGE_SIZE)}
                        >
                            Charger plus ({pages.length}/{pagesResult?.total ?? 0})
                        </DnButton>
                    ) : undefined
                }
            />

            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Tags
                </Typography>
                {values.tags && values.tags.length > 0 ? (
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        {values.tags.map(tag => (
                            <Chip key={tag.id} size="small" label={tag.name} sx={{ bgcolor: tag.color ?? undefined }} />
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="caption" color="text.secondary">
                        Aucun tag.
                    </Typography>
                )}
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
                >
                    L&apos;édition des tags via le pivot `ArticleTag` est différée à une US suivante.
                </Typography>
            </Box>
        </Stack>
    );
}
