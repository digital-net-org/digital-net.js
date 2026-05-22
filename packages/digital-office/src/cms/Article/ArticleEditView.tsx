import * as React from 'react';
import type { ArticleDto, JsonPatchOp } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../api';
import { DnEntityEditView } from '../../entity';
import { ArticleTabContent, ArticleTabGeneral } from './Tabs';

export function ArticleEditView() {
    const api = useDnApi();

    const handleGet = React.useCallback((id: string) => api.catalog.article.getById(id), [api.catalog.article]);

    const handleDelete = React.useCallback((id: string) => api.catalog.article.delete(id), [api.catalog.article]);

    const handleUpdate = React.useCallback(
        (id: string, ops: JsonPatchOp[]) => api.catalog.article.update(id, ops),
        [api.catalog.article]
    );

    const handleCreate = React.useCallback(
        async (values: Partial<ArticleDto>) => {
            const created = await api.catalog.article.create({
                title: String(values.title ?? ''),
                slug: String(values.slug ?? ''),
                description: values.description,
                content: values.content,
                pageId: values.pageId ?? null,
            });
            if (created.hasError || !created.value) return created;
            const extraOps: JsonPatchOp[] = Object.entries(values)
                .filter(
                    ([key, value]) =>
                        !['title', 'slug', 'description', 'content', 'pageId', 'tags', 'media'].includes(key) &&
                        value !== undefined
                )
                .map(([key, value]) => ({ op: 'replace', path: `/${key}`, value }));
            if (extraOps.length > 0) await api.catalog.article.update(created.value, extraOps);
            return created;
        },
        [api.catalog.article]
    );

    return (
        <DnEntityEditView
            entityName="article"
            identifier={{ singular: 'article', plural: 'articles', gender: 'm' }}
            identifierAccessor="title"
            draftStoreName="articles"
            listPath="cms/articles"
            redirectPath="/content-manager/articles"
            tabs={[
                {
                    key: 'general',
                    label: 'Général',
                    content: <ArticleTabGeneral />,
                },
                {
                    key: 'article',
                    label: 'Article',
                    content: <ArticleTabContent />,
                },
            ]}
            onGet={handleGet}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onCreate={handleCreate}
        />
    );
}
