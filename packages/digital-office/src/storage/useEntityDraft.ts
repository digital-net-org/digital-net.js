import React from 'react';
import type { Entity, JsonPatchOp } from '@digital-net-org/digital-api-sdk';
import { DnIdbContext } from './DnIdbContext';
import { IDbStore } from './IDbStore';
import { applyOps, setOp } from './jsonPatch';
import type { IDbDraftRecord } from './types';

export interface UseEntityDraftOptions {
    enabled?: boolean;
}

export interface UseEntityDraftResult<T extends Entity> {
    values: Partial<T>;
    ops: JsonPatchOp[];
    isDirty: boolean;
    hasConflict: boolean;
    baselineUpdatedAt: string | null;
    apiUpdatedAt: string | null;
    setField: (_path: string, _value: unknown) => void;
    discard: () => Promise<void>;
    commit: () => Promise<void>;
}

function storeName(entityName: string): string {
    return `patch:${entityName}`;
}

function pathToAccessor(path: string): string {
    if (!path.startsWith('/')) return path;
    return path.slice(1).split('/')[0];
}

export function useEntityDraft<T extends Entity>(
    entityName: string,
    id: string | undefined,
    apiData: T | undefined,
    options: UseEntityDraftOptions = {}
): UseEntityDraftResult<T> {
    const enabled = options.enabled ?? true;
    const { database, notifyDraftChange } = React.useContext(DnIdbContext);
    const [ops, setOps] = React.useState<JsonPatchOp[]>([]);
    const [baselineUpdatedAt, setBaseline] = React.useState<string | null>(null);

    const store = storeName(entityName);

    React.useEffect(() => {
        let cancelled = false;
        const load = async () => {
            if (!database || !enabled || !id) {
                if (cancelled) return;
                setOps([]);
                setBaseline(null);
                return;
            }
            const record = await IDbStore.get<IDbDraftRecord>(database, store, id);
            if (cancelled) return;
            setOps(record?.ops ?? []);
            setBaseline(record?.baselineUpdatedAt ?? null);
        };
        void load();
        return () => {
            cancelled = true;
        };
    }, [database, enabled, id, store]);

    const values = React.useMemo<Partial<T>>(
        () => applyOps<T>(apiData as Partial<T> | undefined, ops),
        [apiData, ops]
    );

    const isDirty = ops.length > 0;
    const apiUpdatedAt = apiData?.updatedAt ?? null;
    const hasConflict =
        isDirty && !!apiUpdatedAt && !!baselineUpdatedAt && apiUpdatedAt > baselineUpdatedAt;

    const persist = React.useCallback(
        async (nextOps: JsonPatchOp[], nextBaseline: string | null) => {
            if (!database || !id) return;
            if (nextOps.length === 0) {
                await IDbStore.delete(database, store, id);
            } else {
                const record: IDbDraftRecord = {
                    id,
                    ops: nextOps,
                    baselineUpdatedAt: nextBaseline,
                    updatedAt: new Date().toISOString(),
                };
                await IDbStore.save(database, store, record);
            }
            notifyDraftChange();
        },
        [database, id, notifyDraftChange, store]
    );

    const setField = React.useCallback(
        (path: string, value: unknown) => {
            const accessor = pathToAccessor(path);
            const apiValue = (apiData as Record<string, unknown> | undefined)?.[accessor];
            const matchesApi = Object.is(value, apiValue);
            const nextOps = matchesApi
                ? ops.filter(o => o.path !== path)
                : setOp(ops, path, value);
            const nextBaseline =
                baselineUpdatedAt ?? (nextOps.length > 0 ? apiData?.updatedAt ?? null : null);
            setOps(nextOps);
            setBaseline(nextOps.length > 0 ? nextBaseline : null);
            void persist(nextOps, nextOps.length > 0 ? nextBaseline : null);
        },
        [apiData, baselineUpdatedAt, ops, persist]
    );

    const discard = React.useCallback(async () => {
        setOps([]);
        setBaseline(null);
        if (database && id) {
            await IDbStore.delete(database, store, id);
            notifyDraftChange();
        }
    }, [database, id, notifyDraftChange, store]);

    const commit = discard;

    return {
        values,
        ops,
        isDirty,
        hasConflict,
        baselineUpdatedAt,
        apiUpdatedAt,
        setField,
        discard,
        commit,
    };
}
