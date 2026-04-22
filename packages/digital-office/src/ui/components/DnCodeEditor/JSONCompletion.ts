import type { Ace } from 'ace-builds';
import { JSONLD_TYPES, JSONLD_TYPE_NAMES, type JsonLdPropertySpec } from './schemas';

export interface AceCompletion {
    caption: string;
    value: string;
    meta: string;
    docText?: string;
    score: number;
}

interface Frame {
    kind: 'object' | 'array';
    parentKey: string | null;
    type: string | null;
    pendingKey: string | null;
}

type Context =
    | { kind: 'none' }
    | { kind: 'key'; stack: Frame[] }
    | { kind: 'value'; stack: Frame[]; currentKey: string | null };

type StringRole = 'key' | 'value';

export class JSONCompletion {
    public getCompletions(session: Ace.EditSession, pos: { row: number; column: number }): AceCompletion[] {
        const text = session.getValue();
        const offset = this.positionToOffset(text, pos);
        const ctx = this.parse(text, offset);
        if (ctx.kind === 'none') return [];
        if (ctx.kind === 'key') return this.suggestKeys(ctx.stack);
        return this.suggestValues(ctx.stack, ctx.currentKey);
    }

    private positionToOffset(text: string, pos: { row: number; column: number }): number {
        let offset = 0;
        let row = 0;
        for (let i = 0; i < text.length; i++) {
            if (row === pos.row) return offset + pos.column;
            if (text[i] === '\n') {
                row++;
                offset = i + 1;
            }
        }
        return text.length;
    }

    private parse(text: string, offset: number): Context {
        const stack: Frame[] = [];
        let expect: 'key' | 'value' | 'afterKey' | 'afterValue' = 'value';
        let stringRole: StringRole | null = null;
        let stringBuf = '';

        const top = (): Frame | undefined => stack[stack.length - 1];

        for (let i = 0; i < offset; i++) {
            const ch = text[i];

            if (stringRole !== null) {
                if (ch === '\\' && i + 1 < offset) {
                    stringBuf += text[i + 1];
                    i++;
                    continue;
                }
                if (ch === '"') {
                    if (stringRole === 'key') {
                        const f = top();
                        if (f) f.pendingKey = stringBuf;
                        expect = 'afterKey';
                    } else {
                        const f = top();
                        if (f && f.pendingKey === '@type') f.type = stringBuf;
                        if (f) f.pendingKey = null;
                        expect = 'afterValue';
                    }
                    stringRole = null;
                    stringBuf = '';
                    continue;
                }
                stringBuf += ch;
                continue;
            }

            if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') continue;

            if (ch === '"') {
                stringRole = expect === 'key' ? 'key' : 'value';
                stringBuf = '';
                continue;
            }

            if (ch === '{') {
                const parent = top();
                const parentKey = parent ? parent.pendingKey : null;
                stack.push({ kind: 'object', parentKey, type: null, pendingKey: null });
                if (parent) parent.pendingKey = null;
                expect = 'key';
                continue;
            }
            if (ch === '}') {
                stack.pop();
                expect = 'afterValue';
                continue;
            }
            if (ch === '[') {
                const parent = top();
                const parentKey = parent ? parent.pendingKey : null;
                stack.push({ kind: 'array', parentKey, type: null, pendingKey: null });
                if (parent) parent.pendingKey = null;
                expect = 'value';
                continue;
            }
            if (ch === ']') {
                stack.pop();
                expect = 'afterValue';
                continue;
            }
            if (ch === ':') {
                expect = 'value';
                continue;
            }
            if (ch === ',') {
                const f = top();
                expect = f && f.kind === 'object' ? 'key' : 'value';
                continue;
            }
            // number/true/false/null — consume until separator
            while (i < offset && !',}]\n\r\t '.includes(text[i])) i++;
            i--;
            const f = top();
            if (f) f.pendingKey = null;
            expect = 'afterValue';
        }

        if (stringRole === null) return { kind: 'none' };
        if (stringRole === 'key') return { kind: 'key', stack };
        const f = top();
        return { kind: 'value', stack, currentKey: f ? f.pendingKey : null };
    }

    private suggestKeys(stack: Frame[]): AceCompletion[] {
        if (stack.length === 0) return [];
        const innermost = stack[stack.length - 1];
        if (innermost.kind !== 'object') return [];

        const anchor = this.findTypeAnchor(stack);
        if (!anchor) {
            return [
                this.aceCompletion(
                    { property: '@context', valueType: 'URL', status: 'Required', description: 'https://schema.org' },
                    'JSON-LD'
                ),
                this.aceCompletion(
                    { property: '@type', valueType: 'Text', status: 'Required', description: 'Schema type' },
                    'JSON-LD'
                ),
            ];
        }
        const spec = JSONLD_TYPES[anchor.type];
        if (!spec) return [];
        const prefix = anchor.relativePath.length > 0 ? anchor.relativePath.join('.') + '.' : '';
        const seen = new Set<string>();
        const out: AceCompletion[] = [];
        for (const prop of spec.properties) {
            if (!prop.property.startsWith(prefix)) continue;
            const rest = prop.property.slice(prefix.length);
            if (rest.length === 0) continue;
            const segment = rest.split('.')[0];
            if (seen.has(segment)) continue;
            seen.add(segment);
            const meta = this.propertyMeta(prop, segment === rest);
            out.push(this.aceCompletion({ ...prop, property: segment }, meta));
        }
        return out;
    }

    private suggestValues(stack: Frame[], currentKey: string | null): AceCompletion[] {
        if (!currentKey) return [];

        if (currentKey === '@context') {
            return [this.valueCompletion('https://schema.org', 'URL', 'JSON-LD context')];
        }

        if (currentKey === '@type') {
            return this.suggestTypeValues(stack);
        }

        const prop = this.findProperty(stack, currentKey);
        if (!prop) return [];
        return this.extractEnumValues(prop.description, prop.valueType);
    }

    private suggestTypeValues(stack: Frame[]): AceCompletion[] {
        // At root: suggest the full catalog grouped by feature.
        if (stack.length <= 1) {
            return JSONLD_TYPE_NAMES.map(name => {
                const spec = JSONLD_TYPES[name];
                return this.valueCompletion(name, spec.feature, `${spec.feature} — ${name}`);
            });
        }
        // Nested: suggest types valid for the parent property, via parent @type.container.valueType.
        const innermost = stack[stack.length - 1];
        const parentKey = innermost.parentKey;
        if (!parentKey) return [];
        const prop = this.findProperty(stack.slice(0, -1), parentKey, true);
        if (!prop) return [];
        return this.splitPipe(prop.valueType)
            .filter(t => JSONLD_TYPES[t])
            .map(t => this.valueCompletion(t, JSONLD_TYPES[t].feature, `${JSONLD_TYPES[t].feature} — ${t}`));
    }

    private findTypeAnchor(stack: Frame[]): { type: string; relativePath: string[] } | null {
        for (let i = stack.length - 1; i >= 0; i--) {
            const f = stack[i];
            if (f.kind === 'object' && f.type && JSONLD_TYPES[f.type]) {
                const relative: string[] = [];
                for (let j = i + 1; j < stack.length; j++) {
                    const child = stack[j];
                    if (child.kind === 'object' && child.parentKey) relative.push(child.parentKey);
                }
                return { type: f.type, relativePath: relative };
            }
        }
        return null;
    }

    private findProperty(stack: Frame[], key: string, forSelfType = false): JsonLdPropertySpec | null {
        const anchor = this.findTypeAnchor(stack);
        if (!anchor) return null;
        const spec = JSONLD_TYPES[anchor.type];
        if (!spec) return null;
        const path = forSelfType ? [...anchor.relativePath, key] : [...anchor.relativePath, key];
        const joined = path.join('.');
        return spec.properties.find(p => p.property === joined) ?? null;
    }

    private extractEnumValues(description: string, valueType: string): AceCompletion[] {
        const tokens = this.splitPipe(description);
        if (tokens.length < 2) return [];
        // Filter out descriptive text mixed with enums (e.g. "Audiobook | EBook | Hardcover | Paperback" is clean,
        // but "DesktopWeb | Android | iOS" too). A token with spaces is likely natural language, skip entirely.
        if (tokens.some(t => t.includes(' '))) return [];
        return tokens.map(t => this.valueCompletion(t, valueType, t));
    }

    private splitPipe(raw: string): string[] {
        return raw
            .split('|')
            .map(s => s.trim())
            .filter(Boolean);
    }

    private propertyMeta(prop: JsonLdPropertySpec, isLeaf: boolean): string {
        if (!isLeaf) return 'object';
        return prop.status === 'Required' ? `${prop.valueType} *` : prop.valueType;
    }

    private aceCompletion(prop: JsonLdPropertySpec, meta?: string): AceCompletion {
        return {
            caption: prop.property,
            value: prop.property,
            meta: meta ?? prop.valueType,
            docText: prop.description,
            score: this.scoreFor(prop.status),
        };
    }

    private scoreFor(status: JsonLdPropertySpec['status']): number {
        if (status === 'Required') return 1100;
        if (status === 'Recommended') return 1050;
        return 1000;
    }

    private valueCompletion(value: string, meta: string, docText?: string): AceCompletion {
        return { caption: value, value, meta, docText, score: 1000 };
    }
}
