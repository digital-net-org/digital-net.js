import type { JsonPatchOp } from '@digital-net-org/digital-api-sdk';

export interface IDbDraftRecord {
    id: string;
    ops: JsonPatchOp[];
    baselineUpdatedAt: string | null;
    updatedAt: string;
}
