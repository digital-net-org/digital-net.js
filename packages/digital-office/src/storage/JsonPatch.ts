import type { JsonPatchOp } from '@digital-net-org/digital-api-sdk';

export class JsonPatch {
    private static pathSegments(path: string): string[] {
        if (!path.startsWith('/')) throw new Error(`JsonPatch: path must start with '/', got "${path}"`);
        return path.slice(1).split('/').map(seg => seg.replace(/~1/g, '/').replace(/~0/g, '~'));
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
