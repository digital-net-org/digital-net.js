import * as React from 'react';
import { Box, useTheme, type SxProps, type Theme } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import ace from 'ace-builds/src-noconflict/ace';
import type { Ace } from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github_light_default';
import 'ace-builds/src-noconflict/ext-language_tools';
import { formatCode } from './formatters';
import { validateCode } from './validators';

export type DnCodeEditorLanguage = 'javascript' | 'html' | 'css' | 'json';

export interface DnCodeEditorCompletion {
    value: string;
    caption?: string;
    meta?: string;
    description?: string;
    /** Nested suggestions proposed when the cursor is editing the value of this key (JSON only). */
    values?: DnCodeEditorCompletion[];
}

export interface DnCodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: DnCodeEditorLanguage;
    disabled?: boolean;
    completions?: DnCodeEditorCompletion[];
    sx?: SxProps<Theme>;
}

// Shared across all DnCodeEditor instances: a single global ACE completer
// reads the list to suggest for each editor via this map.
const editorCompletions = new WeakMap<Ace.Editor, DnCodeEditorCompletion[]>();
let completerRegistered = false;

type JsonContext = { kind: 'key' } | { kind: 'value'; key?: string } | { kind: 'none' };

/**
 * Walk backwards from (row, col) in JSON source, skipping string contents,
 * tracking balanced {}/[] pairs, to identify whether the cursor edits a key
 * or a value. For values inside an object, also returns the enclosing key.
 *
 * Assumption: the cursor is inside a quoted string — so the first `"` we
 * encounter walking back is the opening quote of the current string.
 */
function getJsonContext(session: Ace.EditSession, row: number, col: number): JsonContext {
    let depth = 0;
    let mostRecent: ',' | ':' | null = null;
    let colonAt: { row: number; col: number } | null = null;
    let insideString = true;
    let r = row;
    let c = col;

    while (r >= 0) {
        const line = session.getLine(r);
        const scanFrom = r === row ? c - 1 : line.length - 1;
        for (let i = scanFrom; i >= 0; i--) {
            const ch = line[i];
            if (ch === '"' && (i === 0 || line[i - 1] !== '\\')) {
                insideString = !insideString;
                continue;
            }
            if (insideString) continue;
            if (ch === '}' || ch === ']') {
                depth++;
                continue;
            }
            if (ch === '{') {
                if (depth === 0) {
                    if (mostRecent === ':' && colonAt) {
                        const key = extractKeyBeforeColon(session, colonAt.row, colonAt.col);
                        return { kind: 'value', key: key ?? undefined };
                    }
                    return { kind: 'key' };
                }
                depth--;
                continue;
            }
            if (ch === '[') {
                if (depth === 0) return { kind: 'value' };
                depth--;
                continue;
            }
            if (depth > 0) continue;
            if (ch === ':' && mostRecent === null) {
                mostRecent = ':';
                colonAt = { row: r, col: i };
            } else if (ch === ',' && mostRecent === null) {
                mostRecent = ',';
            }
        }
        r--;
        c = Number.MAX_SAFE_INTEGER;
    }
    return { kind: 'none' };
}

/** Walk back from right before a `:` and capture the preceding `"..."` text. */
function extractKeyBeforeColon(session: Ace.EditSession, row: number, col: number): string | null {
    let r = row;
    let c = col;
    let phase: 'skipWs' | 'readingKey' = 'skipWs';
    const chars: string[] = [];
    while (r >= 0) {
        const line = session.getLine(r);
        const scanFrom = r === row ? c - 1 : line.length - 1;
        for (let i = scanFrom; i >= 0; i--) {
            const ch = line[i];
            if (phase === 'skipWs') {
                if (ch === ' ' || ch === '\t') continue;
                if (ch === '"') {
                    phase = 'readingKey';
                    continue;
                }
                return null;
            }
            if (ch === '"' && (i === 0 || line[i - 1] !== '\\')) {
                return chars.reverse().join('');
            }
            chars.push(ch);
        }
        r--;
        c = Number.MAX_SAFE_INTEGER;
    }
    return null;
}

function isJsonMode(session: Ace.EditSession): boolean {
    return (session.getMode() as { $id?: string }).$id === 'ace/mode/json';
}

function mapCompletion(c: DnCodeEditorCompletion) {
    return {
        caption: c.caption ?? c.value,
        value: c.value,
        meta: c.meta ?? '',
        docText: c.description,
        score: 1000,
    };
}

function ensureCompleter() {
    if (completerRegistered) return;
    completerRegistered = true;
    const langTools = (ace as unknown as { require: (_: string) => unknown }).require('ace/ext/language_tools') as {
        addCompleter: (_completer: unknown) => void;
    };
    langTools.addCompleter({
        identifierRegexps: [/[@a-zA-Z_0-9\-:/.]/],
        getCompletions(
            editor: Ace.Editor,
            session: Ace.EditSession,
            pos: { row: number; column: number },
            _prefix: string,
            callback: (_err: Error | null, _items: unknown[]) => void
        ) {
            const list = editorCompletions.get(editor);
            if (!list || list.length === 0) return callback(null, []);
            if (!isJsonMode(session)) return callback(null, list.map(mapCompletion));
            const ctx = getJsonContext(session, pos.row, pos.column);
            if (ctx.kind === 'key') return callback(null, list.map(mapCompletion));
            if (ctx.kind === 'value' && ctx.key) {
                const parent = list.find(c => c.value === ctx.key);
                const nested = parent?.values;
                if (nested && nested.length > 0) return callback(null, nested.map(mapCompletion));
            }
            callback(null, []);
        },
    });
}

export function DnCodeEditor({ value, onChange, language, disabled, completions, sx }: DnCodeEditorProps) {
    const theme = useTheme();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<Ace.Editor | null>(null);
    const onChangeRef = React.useRef(onChange);
    const formatRef = React.useRef<() => Promise<void>>(async () => void 0);

    React.useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    React.useEffect(() => {
        formatRef.current = async () => {
            const editor = editorRef.current;
            if (!editor) return;
            const current = editor.getValue();
            const out = await formatCode(current, language);
            if (out !== current && editorRef.current) {
                editorRef.current.setValue(out, 1);
            }
        };
    }, [language]);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const editor = ace.edit(container);
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            useWorker: false,
            showPrintMargin: false,
            fontSize: 13,
        });
        (editor as unknown as { $blockScrolling: number }).$blockScrolling = Infinity;
        editor.setValue(value, 1);
        editor.on('change', () => onChangeRef.current(editor.getValue()));
        editor.on('change', (delta: { action: string; lines: string[] }) => {
            if (delta.action !== 'insert') return;
            if (delta.lines.length !== 1 || delta.lines[0] !== '"') return;
            if (!editorCompletions.has(editor)) return;
            window.setTimeout(() => {
                if (editorRef.current !== editor) return;
                editor.execCommand('startAutocomplete');
            }, 0);
        });
        editor.on('blur', () => {
            void formatRef.current();
        });
        editor.commands.addCommand({
            name: 'dnCodeEditorFormat',
            bindKey: { win: 'Ctrl-Shift-F', mac: 'Shift-Alt-F' },
            exec: () => void formatRef.current(),
        });
        editorRef.current = editor;

        return () => {
            editor.destroy();
            editorRef.current = null;
        };
        // Mount-once effect. Initial value is set via setValue above; further sync via the value effect below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const editor = editorRef.current;
        if (editor && editor.getValue() !== value) {
            editor.setValue(value, 1);
        }
    }, [value]);

    React.useEffect(() => {
        editorRef.current?.session.setMode(`ace/mode/${language}`);
    }, [language]);

    React.useEffect(() => {
        const aceTheme = theme.palette.mode === 'dark' ? 'monokai' : 'github_light_default';
        editorRef.current?.setTheme(`ace/theme/${aceTheme}`);
    }, [theme.palette.mode]);

    React.useEffect(() => {
        editorRef.current?.setReadOnly(disabled ?? false);
    }, [disabled]);

    React.useEffect(() => {
        const timer = window.setTimeout(async () => {
            const annotation = await validateCode(value, language);
            editorRef.current?.session.setAnnotations(annotation ? [annotation] : []);
        }, 250);
        return () => window.clearTimeout(timer);
    }, [value, language]);

    React.useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;
        if (completions && completions.length > 0) {
            ensureCompleter();
            editorCompletions.set(editor, completions);
        } else {
            editorCompletions.delete(editor);
        }
        return () => {
            editorCompletions.delete(editor);
        };
    }, [completions]);

    return (
        <Wrapper
            className="DnCodeEditor"
            sx={sx}
            data-disabled={disabled || undefined}
            aria-disabled={disabled || undefined}
        >
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
        </Wrapper>
    );
}

const Wrapper = styled(Box)(
    ({ theme }) => css`
        position: relative;
        border: 1px solid ${theme.palette.divider};
        border-radius: ${theme.shape.borderRadius};
        overflow: hidden;
        transition: border-color 0.2s ease-in-out;
        height: 100%;
        width: 100%;

        &:focus-within {
            border-color: ${theme.palette.primary.main};
        }

        &[data-disabled] {
            opacity: 0.35;
            pointer-events: none;
            cursor: not-allowed;
            border-color: ${theme.palette.action.disabled};
        }

        & .ace_editor {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
    `
);
