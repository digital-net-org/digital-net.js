export interface PatchOperation<T = any> {
    op: string;
    path: string;
    value: Partial<T>[keyof T];
}

export type Patch<T> = Array<PatchOperation<T>>;
