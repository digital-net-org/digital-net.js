import * as React from 'react';
import { lazyView } from '../lazyView';
import { DigitalOfficeNavGroup } from '../navGroups';
import type { DigitalOfficeRoute } from '../types';

const PageListView = lazyView(() => import('../../cms/Page/PageListView'), 'PageListView');
const PageEditView = lazyView(() => import('../../cms/Page/PageEditView'), 'PageEditView');
const ArticleListView = lazyView(() => import('../../cms/Article/ArticleListView'), 'ArticleListView');
const ArticleEditView = lazyView(() => import('../../cms/Article/ArticleEditView'), 'ArticleEditView');
const FormListView = lazyView(() => import('../../cms/Form/FormListView'), 'FormListView');
const FormEditView = lazyView(() => import('../../cms/Form/FormEditView'), 'FormEditView');
const FormSubmissionDetailView = lazyView(
    () => import('../../cms/Form/FormSubmissionDetailView'),
    'FormSubmissionDetailView'
);
const MediaListView = lazyView(() => import('../../cms/Media/MediaListView'), 'MediaListView');
const MediaEditView = lazyView(() => import('../../cms/Media/MediaEditView'), 'MediaEditView');
const TagListView = lazyView(() => import('../../cms/Tag/TagListView'), 'TagListView');
const TagEditView = lazyView(() => import('../../cms/Tag/TagEditView'), 'TagEditView');

export const CMS_ROUTES: DigitalOfficeRoute[] = [
    {
        path: '/content-manager/pages',
        navGroup: DigitalOfficeNavGroup.ContentManager,
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
        path: '/content-manager/articles',
        navGroup: DigitalOfficeNavGroup.ContentManager,
        navLabel: 'Articles',
        element: <ArticleListView />,
    },
    {
        path: '/content-manager/articles/new',
        element: <ArticleEditView />,
    },
    {
        path: '/content-manager/articles/:id',
        element: <ArticleEditView />,
    },
    {
        path: '/content-manager/forms',
        navGroup: DigitalOfficeNavGroup.ContentManager,
        navLabel: 'Formulaires',
        element: <FormListView />,
    },
    {
        path: '/content-manager/forms/new',
        element: <FormEditView />,
    },
    {
        path: '/content-manager/forms/:id',
        element: <FormEditView />,
    },
    {
        path: '/content-manager/forms/:formId/submissions/:id',
        element: <FormSubmissionDetailView />,
    },
    {
        path: '/content-manager/media',
        navGroup: DigitalOfficeNavGroup.ContentManager,
        navLabel: 'Médias',
        element: <MediaListView />,
    },
    {
        path: '/content-manager/media/:id',
        element: <MediaEditView />,
    },
    {
        path: '/content-manager/tags',
        navGroup: DigitalOfficeNavGroup.ContentManager,
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
];
