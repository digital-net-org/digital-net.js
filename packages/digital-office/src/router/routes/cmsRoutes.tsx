import * as React from 'react';
import {
    ArticleEditView,
    ArticleListView,
    MediaEditView,
    MediaListView,
    PageEditView,
    PageListView,
    TagEditView,
    TagListView,
} from '../../cms';
import type { DigitalOfficeRoute } from '../types';

const NAV_GROUP = 'Gestionnaire de contenu';

export const CMS_ROUTES: DigitalOfficeRoute[] = [
    {
        path: '/content-manager/articles',
        navGroup: NAV_GROUP,
        navLabel: 'Articles',
        element: <ArticleListView />,
    },
    {
        path: '/content-manager/articles/:id',
        element: <ArticleEditView />,
    },
    {
        path: '/content-manager/pages',
        navGroup: NAV_GROUP,
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
        navGroup: NAV_GROUP,
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
        navGroup: NAV_GROUP,
        navLabel: 'Médias',
        element: <MediaListView />,
    },
    {
        path: '/content-manager/media/:id',
        element: <MediaEditView />,
    },
];
