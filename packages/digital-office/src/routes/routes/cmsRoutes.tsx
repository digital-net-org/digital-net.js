import * as React from 'react';
import { PageEditView, PageListView } from '../../cms';
import type { DigitalOfficeRoute } from '../types';

export const CMS_ROUTES: DigitalOfficeRoute[] = [
    {
        path: '/content-manager/pages',
        navGroup: 'Gestionnaire de contenu',
        navLabel: 'Pages',
        element: <PageListView />,
    },
    {
        path: '/content-manager/pages/:id',
        element: <PageEditView />,
    },
];
