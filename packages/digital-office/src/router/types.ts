import type * as React from 'react';

export interface DigitalOfficeRoute {
    path: string;
    navGroup?: string;
    navLabel?: string;
    element: React.ReactNode;
    isPublic?: boolean;
    isAdmin?: boolean;
}
