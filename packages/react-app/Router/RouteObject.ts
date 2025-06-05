import type * as React from 'react';

export interface RouteObject {
    path?: string;
    element: React.ReactNode;
    isPublic?: boolean;
    displayed?: boolean;
    children?: Array<RouteObject>;
}

export type ValidRouteObject = Omit<RouteObject, 'children' | 'element' | 'path'> & { path: string };