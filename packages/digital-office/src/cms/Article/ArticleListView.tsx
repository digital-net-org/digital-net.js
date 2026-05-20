import { useNavigate } from 'react-router';
import { Chip, Stack } from '@mui/material';
import type { ArticleListDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityListView, type DnEntityListViewProps } from '../../entity';
import type { DnColumnDefinition } from '../../ui';

const staticProps: DnEntityListViewProps<ArticleListDto> = {
    title: 'Articles',
    description: 'Gérez les articles publiés via les pages de type Article.',
    identifier: { singular: 'article', plural: 'articles', gender: 'm' },
    identifierAccessor: 'title',
    entityName: 'article',
    listPath: 'cms/articles',
    deletePath: 'cms/articles/:id',
    draftStoreName: 'articles',
    filters: [
        { type: 'like', key: 'name', label: 'Titre', placeholder: 'rechercher…' },
        { type: 'boolean', key: 'published', label: 'Publiés uniquement' },
    ],
};

const columns: DnColumnDefinition<ArticleListDto>[] = [
    { key: 'title', label: 'Titre' },
    { key: 'slug', label: 'Slug' },
    {
        kind: 'computed',
        key: 'tags',
        label: 'Tags',
        compute: row =>
            row.tags.length > 0 ? (
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    {row.tags.map(tag => (
                        <Chip key={tag.id} size="small" label={tag.name} sx={{ bgcolor: tag.color ?? undefined }} />
                    ))}
                </Stack>
            ) : (
                '—'
            ),
    },
    { key: 'publishedAt', label: 'Publié le' },
    { key: 'updatedAt', label: 'Modifié le' },
];

export function ArticleListView() {
    const navigate = useNavigate();
    return (
        <DnEntityListView
            {...staticProps}
            columns={columns}
            onRowClick={row => navigate(`/content-manager/articles/${row.id}`)}
            onCreate={() => navigate('new')}
        />
    );
}
