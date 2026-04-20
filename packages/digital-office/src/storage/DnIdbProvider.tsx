import React, { type PropsWithChildren } from 'react';
import { IDbAccessor } from './IDbAccessor';
import { DnIdbContext, type DnIdbContextValue } from './DnIdbContext';
import type { IDbConfig } from './types';

const DEFAULT_CONFIG: IDbConfig = {
    name: 'office-drafts',
    version: 1,
    stores: ['patch:pages'] as const,
};

export interface DnIdbProviderProps extends PropsWithChildren {
    config?: IDbConfig;
}

export function DnIdbProvider({ children, config = DEFAULT_CONFIG }: DnIdbProviderProps) {
    const [database, setDatabase] = React.useState<IDBDatabase | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
    const [draftBump, setDraftBump] = React.useState(0);

    React.useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const db = await IDbAccessor.initDatabase(config);
                if (cancelled) {
                    db.close();
                    return;
                }
                setDatabase(db);
                setIsLoading(false);
            } catch {
                if (cancelled) return;
                setHasError(true);
                setIsLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [config]);

    const notifyDraftChange = React.useCallback(() => setDraftBump(n => n + 1), []);

    const value = React.useMemo<DnIdbContextValue>(
        () => ({ ...config, database, isLoading, hasError, draftBump, notifyDraftChange }),
        [config, database, isLoading, hasError, draftBump, notifyDraftChange]
    );

    return <DnIdbContext.Provider value={value}>{children}</DnIdbContext.Provider>;
}
