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

export type DnCodeEditorLanguage = 'javascript' | 'html' | 'css' | 'json';

export interface DnCodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: DnCodeEditorLanguage;
    height?: number | string;
    width?: number | string;
    readOnly?: boolean;
    placeholder?: string;
    name?: string;
    className?: string;
    sx?: SxProps<Theme>;
    onFormat?: (formatted: string) => void;
}

const resolveSize = (size: number | string): string => (typeof size === 'number' ? `${size}px` : size);

export function DnCodeEditor({
    value,
    onChange,
    language,
    height = '240px',
    width = '100%',
    readOnly,
    placeholder,
    name,
    className,
    sx,
    onFormat,
}: DnCodeEditorProps) {
    const theme = useTheme();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<Ace.Editor | null>(null);
    const onChangeRef = React.useRef(onChange);
    const formatRef = React.useRef<() => Promise<void>>(async () => {});

    React.useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    React.useEffect(() => {
        formatRef.current = async () => {
            const editor = editorRef.current;
            if (!editor) return;
            const current = editor.getValue();
            const out = await formatCode(current, language);
            if (out !== current) {
                editor.setValue(out, 1);
                onFormat?.(out);
            }
        };
    }, [language, onFormat]);

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
        editorRef.current?.setReadOnly(readOnly ?? false);
    }, [readOnly]);

    React.useEffect(() => {
        editorRef.current?.setOption('placeholder', placeholder ?? '');
    }, [placeholder]);

    return (
        <Wrapper
            className={`DnCodeEditor ${className ?? ''}`}
            sx={sx}
            style={{ width: resolveSize(width), height: resolveSize(height) }}
            data-readonly={readOnly || undefined}
        >
            <div ref={containerRef} data-name={name} style={{ width: '100%', height: '100%' }} />
        </Wrapper>
    );
}

const Wrapper = styled(Box)(
    ({ theme }) => css`
        position: relative;
        border: 1px solid ${theme.palette.divider};
        border-radius: ${theme.shape.borderRadius}px;
        overflow: hidden;
        transition: border-color 0.2s ease-in-out;

        &:focus-within {
            border-color: ${theme.palette.primary.main};
        }

        &[data-readonly] {
            opacity: 0.7;
        }

        & .ace_editor {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
    `
);
