export type JsonPatchOp =
    | { op: 'replace'; path: string; value: unknown }
    | { op: 'add'; path: string; value: unknown }
    | { op: 'remove'; path: string };
