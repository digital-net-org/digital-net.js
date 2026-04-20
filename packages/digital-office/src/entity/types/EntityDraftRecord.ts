import type { JsonPatchOp } from '@digital-net-org/digital-api-sdk';

/** Shape of a per-entity draft record persisted in IndexedDB. */
export interface EntityDraftRecord {
    id: string;
    ops: JsonPatchOp[];
    baselineUpdatedAt: string | null;
    updatedAt: string;
}
