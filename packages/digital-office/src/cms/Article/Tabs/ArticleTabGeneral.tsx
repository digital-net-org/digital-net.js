import * as React from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { StringResolver } from '@digital-net-org/digital-core';
import type { ArticleDto, PageDto, QueryResult } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../../api';
import {
    DN_QUERY_KEY_LIST,
    DnEntityForm,
    type DnEntityFormProps,
    useDnEntityFormContext,
    useEntitySchema,
} from '../../../entity';
import { useCustomNode } from '../../../custom-render';
import { DnButton, DnIconButton, DnInputAutocomplete, DnInputDebounced } from '../../../ui';

const SLUG_HELPER = 'Segment d\'URL public de l\'article (ex: "mon-article").';
const SLUG_AVAILABILITY_ERROR = "Ce segment d'URL est déjà utilisé.";
const SLUG_DEBOUNCE_MS = 1500;

const baseFieldProps: DnEntityFormProps['fieldProps'] = {
    Title: {
        label: 'Titre',
        helperText: "Titre éditorial de l'article, affiché dans les listings et utilisé pour le rendu.",
    },
    Description: {
        label: 'Description',
        helperText: 'Description courte (peut être utilisée par la page-template).',
    },
    Slug: {
        label: 'Segment URL',
        helperText: SLUG_HELPER,
    },
    PublishedAt: {
        label: 'Publié le',
        helperText: "Date de publication. Si vide, l'article reste en brouillon (non atteignable publiquement).",
    },
};

const INTERPOLABLE_PAGES_PAGE_SIZE = 10;

export function ArticleTabGeneral() {
    const api = useDnApi();
    const { id } = useParams<{ id: string }>();
    const { schemas } = useEntitySchema('article');
    const { values, apiData, setField, errors, disabled } = useDnEntityFormContext<ArticleDto>();
    const { renderCustomNode } = useCustomNode();

    const slugSchema = React.useMemo(() => schemas.find(s => s.name === 'Slug'), [schemas]);
    const slugPattern = slugSchema?.regexValidation ?? undefined;
    const currentSlug = String(values.slug ?? '');
    const apiSlug = String(apiData?.slug ?? '');

    const [slugAvailabilityError, setSlugAvailabilityError] = React.useState(false);
    const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSlugAvailabilityError(false);
        setField('/slug', event.target.value);
    };
    const handleSlugDebounced = async (next: string, signal: AbortSignal) => {
        const res = await api.catalog.article.checkSlugAvailability(next, id, { signal });
        if (signal.aborted) return;
        setSlugAvailabilityError(!res.hasError && !res.value);
    };
    const titleSource = String(values.title ?? '');
    const handleAutoSlug = () => {
        const next = StringResolver.toKebabCase(titleSource);
        if (!next || next === currentSlug) return;
        setSlugAvailabilityError(false);
        setField('/slug', next);
    };

    const fieldProps: DnEntityFormProps['fieldProps'] = {
        ...baseFieldProps,
        Slug: {
            ...baseFieldProps.Slug,
            render:
                slugSchema && slugPattern ? (
                    <DnInputDebounced
                        type="text"
                        label="Segment URL"
                        value={currentSlug}
                        max={slugSchema.maxLength ?? undefined}
                        required={slugSchema.isRequired ?? undefined}
                        disabled={disabled}
                        pattern={slugPattern}
                        error={errors?.has('slug') || slugAvailabilityError}
                        helperText={slugAvailabilityError ? SLUG_AVAILABILITY_ERROR : SLUG_HELPER}
                        debounceInMs={SLUG_DEBOUNCE_MS}
                        skipWhen={value => value === apiSlug}
                        onChange={handleSlugChange}
                        onDebounced={handleSlugDebounced}
                        endAction={
                            <DnIconButton
                                tooltip="Générer le segment depuis le titre"
                                disabled={disabled || !titleSource.trim()}
                                onClick={handleAutoSlug}
                            >
                                <AutoAwesomeIcon />
                            </DnIconButton>
                        }
                    />
                ) : null,
        },
    };

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
            {renderCustomNode({ entity: 'article', view: 'edit:tab:general:before' })}
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
            {renderCustomNode({ entity: 'article', view: 'edit:tab:general:after' })}
        </Stack>
    );
}
