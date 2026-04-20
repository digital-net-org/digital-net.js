import { useParams } from 'react-router';
import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityView, type DnEntityViewTab, useEntityGet } from '../../entity';
import { DnLoadingView } from '../../ui';
import { PageEditTabGeneral } from './PageEditTabGeneral';
import { PageEditTabJsonLd } from './PageEditTabJsonLd';
import { PageEditTabOpenGraph } from './PageEditTabOpenGraph';
import { PageEditTabSheets } from './PageEditTabSheets';

export function PageEditView() {
    const { id } = useParams<{ id: string }>();
    const { data: page, isLoading, isNew } = useEntityGet<PageDto>('cms/pages/:id', id);

    if (isLoading) return <DnLoadingView />;

    const tabs: DnEntityViewTab[] = [
        { key: 'general', label: 'Général', content: <PageEditTabGeneral page={page} isNew={isNew} /> },
        { key: 'jsonld', label: 'JSON-LD', content: <PageEditTabJsonLd page={page} /> },
        { key: 'opengraph', label: 'OpenGraph', content: <PageEditTabOpenGraph page={page} /> },
        { key: 'sheets', label: 'Sheets', content: <PageEditTabSheets /> },
    ];

    return <DnEntityView title={isNew ? 'Créer une nouvelle page' : `Édition : ${page!.path}`} tabs={tabs} />;
}
