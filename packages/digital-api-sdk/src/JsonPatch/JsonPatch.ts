import type { JsonPatchOp } from '../types';

export class JsonPatch {
    private static pathSegments(path: string): string[] {
        if (!path.startsWith('/')) throw new Error(`JsonPatch: path must start with '/', got "${path}"`);
        return path
            .slice(1)
            .split('/')
            .map(seg => seg.replace(/~1/g, '/').replace(/~0/g, '~'));
    }

    private static cloneShallow<T>(source: T): T {
        if (Array.isArray(source)) return [...source] as unknown as T;
        if (source && typeof source === 'object') return { ...(source as object) } as T;
        return source;
    }

    private static setAtPath(target: Record<string, unknown>, segments: string[], value: unknown): void {
        let cursor: Record<string, unknown> = target;
        for (let i = 0; i < segments.length - 1; i++) {
            const seg = segments[i];
            const next = cursor[seg];
            const cloned = JsonPatch.cloneShallow(next) ?? {};
            cursor[seg] = cloned;
            cursor = cloned as Record<string, unknown>;
        }
        cursor[segments[segments.length - 1]] = value;
    }

    private static deleteAtPath(target: Record<string, unknown>, segments: string[]): void {
        let cursor: Record<string, unknown> = target;
        for (let i = 0; i < segments.length - 1; i++) {
            const seg = segments[i];
            const next = cursor[seg];
            if (next === undefined || next === null) return;
            const cloned = JsonPatch.cloneShallow(next);
            cursor[seg] = cloned;
            cursor = cloned as Record<string, unknown>;
        }
        delete cursor[segments[segments.length - 1]];
    }

    /** Applies an array of JSON Patch ops on top of a shallow-copy of `base`. */
    public static applyOps<T extends object>(base: Partial<T> | undefined, ops: JsonPatchOp[]): Partial<T> {
        const result: Record<string, unknown> = { ...(base ?? {}) };
        for (const op of ops) {
            const segments = JsonPatch.pathSegments(op.path);
            if (op.op === 'remove') {
                JsonPatch.deleteAtPath(result, segments);
            } else {
                JsonPatch.setAtPath(result, segments, op.value);
            }
        }
        return result as Partial<T>;
    }

    /**
     * Builds `replace` ops for every key whose value changed between `previous` and `next`.
     * When `keys` is provided only those keys are compared, otherwise every key of `next` is.
     * `undefined` values are normalized to `null` so a field cleared by the user is explicitly reset.
     */
    public static diff<T extends object>(previous: Partial<T>, next: T, keys?: readonly (keyof T)[]): JsonPatchOp[] {
        const compared = keys ?? (Object.keys(next) as (keyof T)[]);
        const ops: JsonPatchOp[] = [];
        for (const key of compared) {
            if (previous[key] !== next[key]) {
                ops.push({ op: 'replace', path: `/${String(key)}`, value: next[key] ?? null });
            }
        }
        return ops;
    }

    /**
     * Builds `replace` ops for every defined (non-`undefined`) entry of `values`, skipping any key
     * listed in `options.omit`. Typically used right after creating an entity to persist the
     * remaining fields in a single PATCH.
     */
    public static fromValues<T extends object>(
        values: Partial<T>,
        options: { omit?: readonly (keyof T)[] } = {}
    ): JsonPatchOp[] {
        const omitted = new Set<PropertyKey>(options.omit);
        const ops: JsonPatchOp[] = [];
        for (const [key, value] of Object.entries(values)) {
            if (value === undefined || omitted.has(key)) continue;
            ops.push({ op: 'replace', path: `/${key}`, value });
        }
        return ops;
    }

    /** Returns a new ops array with the `/path` op upserted (removes any prior op on the same path). */
    public static setOp(ops: JsonPatchOp[], path: string, value: unknown): JsonPatchOp[] {
        const filtered = ops.filter(o => o.path !== path);
        if (value === undefined) {
            filtered.push({ op: 'remove', path });
        } else {
            filtered.push({ op: 'replace', path, value });
        }
        return filtered;
    }

    /** Returns a new ops array without any op on `/path`. */
    public static removeOpAt(ops: JsonPatchOp[], path: string): JsonPatchOp[] {
        return ops.filter(o => o.path !== path);
    }
}
