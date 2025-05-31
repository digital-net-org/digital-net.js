export interface PatchOperation<T> {
    op: string;
    path: string;
    value: Partial<T>[keyof T];
}

export type Patch<T> = Array<PatchOperation<T>>;
