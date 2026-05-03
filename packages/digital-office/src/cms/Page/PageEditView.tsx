import * as React from 'react';
import type { JsonPatchOp, PageDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityEditView } from '../../entity';
import { useDnApi } from '../../api';
import { PageTabGeneral, PageTabJsonLd, PageTabOpenGraph, PageTabSheets } from './Tabs';

export function PageEditView() {
    const api = useDnApi();

    const handleGet = React.useCallback((id: string) => api.catalog.page.getById(id), [api.catalog.page]);

    const handleDelete = React.useCallback((id: string) => api.catalog.page.delete(id), [api.catalog.page]);

    const handleUpdate = React.useCallback(
        (id: string, ops: JsonPatchOp[]) => api.catalog.page.update(id, ops),
        [api.catalog.page]
    );

    const handleCreate = React.useCallback(
        async (values: Partial<PageDto>) => {
            const created = await api.catalog.page.create({ path: String(values.path ?? '') });
            if (created.hasError || !created.value) return created;
            const extraOps: JsonPatchOp[] = Object.entries(values)
                .filter(([key, value]) => key !== 'path' && value !== undefined)
                .map(([key, value]) => ({ op: 'replace', path: `/${key}`, value }));
            if (extraOps.length > 0) await api.catalog.page.update(created.value, extraOps);
            return created;
        },
        [api.catalog.page]
    );

    return (
        <DnEntityEditView<PageDto>
            entityName="page"
            identifier={{ singular: 'page', plural: 'pages', gender: 'f' }}
            identifierAccessor="path"
            draftStoreName="pages"
            listPath="cms/pages"
            redirectPath="/content-manager/pages"
            tabs={[
                { key: 'general', label: 'Général', content: <PageTabGeneral /> },
                { key: 'jsonld', label: 'JSON-LD', content: <PageTabJsonLd /> },
                { key: 'opengraph', label: 'OpenGraph', content: <PageTabOpenGraph /> },
                { key: 'sheets', label: 'Sheets', content: <PageTabSheets /> },
            ]}
            onGet={handleGet}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onCreate={handleCreate}
        />
    );
}
