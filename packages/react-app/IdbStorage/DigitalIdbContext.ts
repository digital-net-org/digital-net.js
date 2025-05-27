import React from 'react';
import { type IDbConfig } from './types/IDbConfig';

export interface DigitalIdbContextState extends IDbConfig {
    isLoading: boolean;
    hasError: boolean;
    database: IDBDatabase | null;
    outdatedQueries: Array<string>;
    addOutdatedQuery: (store: string, id: string) => void;
    deleteOutdatedQuery: (store: string, id: string) => void;
}

export const defaultIdbConfig: IDbConfig = {
    name: 'null',
    stores: [],
    version: undefined,
};

export const DigitalIdbContext = React.createContext<DigitalIdbContextState>({
    ...defaultIdbConfig,
    isLoading: false,
    hasError: false,
    database: null,
    outdatedQueries: [],
    addOutdatedQuery: () => undefined,
    deleteOutdatedQuery: () => undefined,
});
