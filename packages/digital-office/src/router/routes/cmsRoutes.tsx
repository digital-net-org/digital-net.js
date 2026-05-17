import * as React from 'react';
import {
    MediaEditView,
    MediaListView,
    PageEditView,
    PageListView,
    TagEditView,
    TagListView,
} from '../../cms';
import type { DigitalOfficeRoute } from '../types';

export const CMS_ROUTES: DigitalOfficeRoute[] = [
    {
        path: '/content-manager/pages',
        navGroup: 'Gestionnaire de contenu',
        navLabel: 'Pages',
        element: <PageListView />,
    },
    {
        path: '/content-manager/pages/new',
        element: <PageEditView />,
    },
    {
        path: '/content-manager/pages/:id',
        element: <PageEditView />,
    },
    {
        path: '/content-manager/tags',
        navGroup: 'Gestionnaire de contenu',
        navLabel: 'Tags',
        element: <TagListView />,
    },
    {
        path: '/content-manager/tags/new',
        element: <TagEditView />,
    },
    {
        path: '/content-manager/tags/:id',
        element: <TagEditView />,
    },
    {
        path: '/content-manager/media',
        navGroup: 'Gestionnaire de contenu',
        navLabel: 'Médias',
        element: <MediaListView />,
    },
    {
        path: '/content-manager/media/:id',
        element: <MediaEditView />,
    },
];
