import * as React from 'react';
import { UserEditView, UserListView } from '../../admin';
import { DigitalOfficeNavGroup } from '../navGroups';
import type { DigitalOfficeRoute } from '../types';

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
