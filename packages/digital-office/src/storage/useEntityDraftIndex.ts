import React from 'react';
import type { JsonPatchOp } from '@digital-net-org/digital-api-sdk';
import { DnIdbContext } from './DnIdbContext';
import { IDbStore } from './IDbStore';
import type { IDbDraftRecord } from './types';

export interface UseEntityDraftIndexResult {
    drafts: Map<string, JsonPatchOp[]>;
    isLoading: boolean;
}

export function useEntityDraftIndex(entityName: string): UseEntityDraftIndexResult {
    const { database, draftBump } = React.useContext(DnIdbContext);
    const [drafts, setDrafts] = React.useState<Map<string, JsonPatchOp[]>>(new Map());
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (!database) return;
        let cancelled = false;
        const load = async () => {
            if (cancelled) return;
            setIsLoading(true);
            try {
                const records = await IDbStore.getAll<IDbDraftRecord>(database, `patch:${entityName}`);
                if (cancelled) return;
                const map = new Map<string, JsonPatchOp[]>();
                for (const r of records) {
                    if (r.ops.length > 0) map.set(r.id, r.ops);
                }
                setDrafts(map);
            } catch {
                if (!cancelled) setDrafts(new Map());
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, [database, entityName, draftBump]);

    return { drafts, isLoading };
}
