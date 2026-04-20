import * as React from 'react';
import { UserEditView, UserListView } from '../../admin';
import type { DigitalOfficeRoute } from '../types';

export const ADMIN_ROUTES: DigitalOfficeRoute[] = [
    {
        path: '/admin/user',
        navGroup: 'Administration',
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