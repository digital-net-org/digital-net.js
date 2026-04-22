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
import { JSONCompletion } from './JSONCompletion';

export type DnCodeEditorLanguage = 'javascript' | 'html' | 'css' | 'json';
export type DnCodeEditorAutocomplete = 'javascript' | 'html' | 'css' | 'jsonld';

export interface DnCodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: DnCodeEditorLanguage;
    autocomplete?: DnCodeEditorAutocomplete;
    disabled?: boolean;
    sx?: SxProps<Theme>;
}

interface AceCompleterRegistry {
    completers?: unknown[];
}

const jsonldCompleters = new WeakMap<Ace.Editor, JSONCompletion>();
const defaultCompleterSnapshots = new WeakMap<Ace.Editor, unknown[] | undefined>();

const jsonldAceCompleter: unknown = {
    identifierRegexps: [/[@a-zA-Z_0-9\-:/.]/],
    getCompletions(
        editor: Ace.Editor,
        session: Ace.EditSession,
        pos: { row: number; column: number },
        _prefix: string,
        callback: (_err: Error | null, _items: unknown[]) => void
    ) {
        const completion = jsonldCompleters.get(editor);
        if (!completion) return callback(null, []);
        callback(null, completion.getCompletions(session, pos));
    },
};

function resolveAutocomplete(
    language: DnCodeEditorLanguage,
    autocomplete: DnCodeEditorAutocomplete | undefined
): DnCodeEditorAutocomplete | null {
    if (autocomplete) return autocomplete;
    if (language === 'json') return null;
    return language;
}

export function DnCodeEditor({ value, onChange, language, autocomplete, disabled, sx }: DnCodeEditorProps) {
    const theme = useTheme();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<Ace.Editor | null>(null);
    const onChangeRef = React.useRef(onChange);
    const formatRef = React.useRef<() => Promise<void>>(async () => void 0);
    const activeMode = resolveAutocomplete(language, autocomplete);

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
            if (!jsonldCompleters.has(editor)) return;
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
        // ACE exposes a public `completers` array on the editor, but it is not surfaced in
        // the TS types — access it through a local structural type.
        const reg = editor as unknown as AceCompleterRegistry;
        if (activeMode === 'jsonld') {
            jsonldCompleters.set(editor, new JSONCompletion());
            // Replace ACE's default completer chain so the built-in "local word" completer
            // doesn't surface noisy suggestions (e.g. document keywords) inside free-text
            // JSON values. Snapshot the defaults so we can restore them on teardown.
            if (!defaultCompleterSnapshots.has(editor)) {
                defaultCompleterSnapshots.set(editor, reg.completers);
            }
            reg.completers = [jsonldAceCompleter];
        } else {
            jsonldCompleters.delete(editor);
            if (defaultCompleterSnapshots.has(editor)) {
                reg.completers = defaultCompleterSnapshots.get(editor);
                defaultCompleterSnapshots.delete(editor);
            }
        }
        return () => {
            jsonldCompleters.delete(editor);
            if (defaultCompleterSnapshots.has(editor)) {
                reg.completers = defaultCompleterSnapshots.get(editor);
                defaultCompleterSnapshots.delete(editor);
            }
        };
    }, [activeMode]);

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
