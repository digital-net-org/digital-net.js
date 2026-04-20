import type { JsonPatchOp, PageDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityEditView } from '../../entity';
import { useDnApi } from '../../api';
import { PageEditTabGeneral } from './PageEditTabGeneral';
import { PageEditTabJsonLd } from './PageEditTabJsonLd';
import { PageEditTabOpenGraph } from './PageEditTabOpenGraph';
import { PageEditTabSheets } from './PageEditTabSheets';

export function PageEditView() {
    const api = useDnApi();
    return (
        <DnEntityEditView<PageDto>
            entityName="page"
            identifier={{ singular: 'page', plural: 'pages', gender: 'f' }}
            identifierAccessor="path"
            draftStoreName="pages"
            listPath="cms/pages"
            redirectPath="/content-manager/pages"
            tabs={[
                { key: 'general', label: 'Général', content: <PageEditTabGeneral /> },
                { key: 'jsonld', label: 'JSON-LD', content: <PageEditTabJsonLd /> },
                { key: 'opengraph', label: 'OpenGraph', content: <PageEditTabOpenGraph /> },
                { key: 'sheets', label: 'Sheets', content: <PageEditTabSheets /> },
            ]}
            onGet={id => api.catalog.page.getById(id)}
            onCreate={async values => {
                const created = await api.catalog.page.create({ path: String(values.path ?? '') });
                if (created.hasError || !created.value) return created;
                const extraOps: JsonPatchOp[] = Object.entries(values)
                    .filter(([key, value]) => key !== 'path' && value !== undefined)
                    .map(([key, value]) => ({ op: 'replace', path: `/${key}`, value }));
                if (extraOps.length > 0) await api.catalog.page.update(created.value, extraOps);
                return created;
            }}
            onUpdate={(id, ops) => api.catalog.page.update(id, ops)}
            onDelete={id => api.catalog.page.delete(id)}
        />
    );
}
