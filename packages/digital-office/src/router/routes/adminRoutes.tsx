import * as React from 'react';
import { lazyView } from '../lazyView';
import { DigitalOfficeNavGroup } from '../navGroups';
import type { DigitalOfficeRoute } from '../types';

const UserListView = lazyView(() => import('../../admin/UserListView'), 'UserListView');
const UserEditView = lazyView(() => import('../../admin/UserEditView'), 'UserEditView');

export const ADMIN_ROUTES: DigitalOfficeRoute[] = [
    {
        path: '/admin/user',
        navGroup: DigitalOfficeNavGroup.Administration,
        navLabel: 'Utilisateurs',
        element: <UserListView />,
        isAdmin: true,
    },
    {
        path: '/admin/user/:id',
        element: <UserEditView />,
        isAdmin: true,
    },
];
