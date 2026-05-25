import * as React from 'react';
import type { ArticleDto, JsonPatchOp, SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../api';
import { DnEntityEditView, defaultValidate } from '../../entity';
import { ArticleTabContent, ArticleTabGeneral } from './Tabs';

const DEFAULT_CONTENT = '<p class="paragraph"></p>';

export function ArticleEditView() {
    const api = useDnApi();

    const handleGet = React.useCallback((id: string) => api.catalog.article.getById(id), [api.catalog.article]);

    const handleDelete = React.useCallback((id: string) => api.catalog.article.delete(id), [api.catalog.article]);

    const handleUpdate = React.useCallback(
        (id: string, ops: JsonPatchOp[]) => {
            const patched = ops.map(op => {
                if (op.path === '/tags') return { ...op, path: '/tag' };
                // @ts-expect-error - Value does exists in some cases
                if (op.path === '/content' && !op.value) return { ...op, value: DEFAULT_CONTENT };
                return op;
            });
            return api.catalog.article.update(id, patched);
        },
        [api.catalog.article]
    );

    const validate = React.useCallback(
        (values: Partial<ArticleDto>, schemas: SchemaProperty[]) =>
            defaultValidate(
                values,
                schemas.filter(s => s.name !== 'Content')
            ),
        []
    );

    const handleCreate = React.useCallback(
        async (values: Partial<ArticleDto>) => {
            const created = await api.catalog.article.create({
                title: String(values.title ?? ''),
                slug: String(values.slug ?? ''),
                description: values.description,
                content: values.content || DEFAULT_CONTENT,
                pageId: values.pageId ?? null,
            });
            if (created.hasError || !created.value) return created;
            const extraOps: JsonPatchOp[] = [];
            if (values.tags?.length) extraOps.push({ op: 'replace', path: '/tag', value: values.tags });
            if (values.related?.length) extraOps.push({ op: 'replace', path: '/related', value: values.related });
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
            validate={validate}
        />
    );
}
