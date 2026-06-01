import * as React from 'react';
import { IDbAccessor } from './IDbAccessor';
import type { IDbConfig } from './IDbConfig';

export interface IdbContextValue extends IDbConfig {
    database: IDBDatabase | null;
    isLoading: boolean;
    hasError: boolean;
    draftBump: number;
    notifyDraftChange: () => void;
}

export const DRAFT_STORES = ['pages', 'tags', 'media', 'articles', 'forms'] as const;
const DRAFTS_DB_CONFIG: IDbConfig = {
    name: 'office-drafts',
    version: 5,
    stores: DRAFT_STORES.map(name => `patch:${name}`),
};

export const IdbContext = React.createContext<IdbContextValue>({
    name: '',
    version: 0,
    stores: [],
    database: null,
    isLoading: false,
    hasError: false,
    draftBump: 0,
    notifyDraftChange: () => undefined,
});

export function IdbProvider({ children }: React.PropsWithChildren) {
    const [database, setDatabase] = React.useState<IDBDatabase | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
    const [draftBump, setDraftBump] = React.useState(0);

    React.useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const db = await IDbAccessor.initDatabase(DRAFTS_DB_CONFIG);
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
    }, []);

    const notifyDraftChange = React.useCallback(() => setDraftBump(n => n + 1), []);

    const value = React.useMemo<IdbContextValue>(
        () => ({ ...DRAFTS_DB_CONFIG, database, isLoading, hasError, draftBump, notifyDraftChange }),
        [database, isLoading, hasError, draftBump, notifyDraftChange]
    );

    return <IdbContext.Provider value={value}>{children}</IdbContext.Provider>;
}
