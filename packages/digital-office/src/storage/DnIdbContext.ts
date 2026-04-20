import React from 'react';
import type { IDbConfig } from './types';

export interface DnIdbContextValue extends IDbConfig {
    database: IDBDatabase | null;
    isLoading: boolean;
    hasError: boolean;
    draftBump: number;
    notifyDraftChange: () => void;
}

export const DnIdbContext = React.createContext<DnIdbContextValue>({
    name: '',
    version: 0,
    stores: [],
    database: null,
    isLoading: false,
    hasError: false,
    draftBump: 0,
    notifyDraftChange: () => undefined,
});
