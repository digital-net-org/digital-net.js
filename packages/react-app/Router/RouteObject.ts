import type * as React from 'react';

export interface RouteObject {
    path: string;
    element: React.ReactNode;
    isPublic: boolean;
    displayed?: boolean;
}
