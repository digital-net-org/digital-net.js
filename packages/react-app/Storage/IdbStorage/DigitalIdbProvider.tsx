import React, { type PropsWithChildren } from 'react';
import type { IDbConfig } from './types/IDbConfig';
import { DigitalIdbContext } from './DigitalIdbContext';
import { IDbAccessor } from './IDbAccessor';

const defaultIdbConfig: IDbConfig = {
    stores: ['pages'],
    name: 'safari-digital',
    version: 1,
};

export function DigitalIdbProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [database, setDatabase] = React.useState<IDBDatabase | null>(null);
    const [outdatedQueries, setOutdatedQueries] = React.useState<Array<string>>([]);

    React.useEffect(() => {
        (async () => {
            if (isLoading || database !== null || hasError) {
                return;
            }
            setIsLoading(true);
            try {
                const result = await IDbAccessor.initDatabase(defaultIdbConfig);
                setDatabase(result);
            } catch (error) {
                setHasError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [database, hasError, isLoading]);

    const addOutdatedQuery = React.useCallback((store: string, id: string) => {
        setOutdatedQueries(prev => [...prev, `${store}:${id}`]);
    }, []);

    const deleteOutdatedQuery = React.useCallback((store: string, id: string) => {
        setOutdatedQueries(prev => prev.filter(query => query !== `${store}:${id}`));
    }, []);

    return (
        <DigitalIdbContext.Provider
            value={{
                isLoading,
                hasError,
                database,
                outdatedQueries,
                addOutdatedQuery,
                deleteOutdatedQuery,
                ...defaultIdbConfig,
            }}
        >
            {children}
        </DigitalIdbContext.Provider>
    );
}
