import * as React from 'react';
import { Box } from '@mui/material';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, $insertNodes, type EditorState } from 'lexical';
import { LEXICAL_NODES, LEXICAL_THEME } from './lexicalConfig';
import { LexicalToolbar } from './LexicalToolbar';
import { LexicalRoot } from './LexicalRoot';

export interface LexicalRichEditorProps {
    value: string;
    onChange: (_html: string) => void;
    disabled?: boolean;
}

export function LexicalRichEditor({ value, onChange, disabled = false }: LexicalRichEditorProps) {
    const initialConfig = React.useMemo(
        () => ({
            namespace: 'article-editor',
            theme: LEXICAL_THEME,
            nodes: LEXICAL_NODES,
            editable: !disabled,
            onError(error: Error) {
                console.error('[Lexical] error:', error);
            },
        }),
        [disabled]
    );

    return (
        <LexicalRoot>
            <LexicalComposer initialConfig={initialConfig}>
                <LexicalToolbar disabled={disabled} />
                <EditorBody initialValue={value} onChange={onChange} disabled={disabled} />
                <HistoryPlugin />
                <LinkPlugin />
                <ListPlugin />
            </LexicalComposer>
        </LexicalRoot>
    );
}

interface EditorBodyProps {
    initialValue: string;
    onChange: (_html: string) => void;
    disabled: boolean;
}

function EditorBody({ initialValue, onChange, disabled }: EditorBodyProps) {
    const [editor] = useLexicalComposerContext();
    const initRef = React.useRef(false);

    // Hydrate the editor once with the initial HTML.
    React.useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;
        editor.update(() => {
            const root = $getRoot();
            root.clear();
            if (!initialValue) return;
            const parser = new DOMParser();
            const dom = parser.parseFromString(initialValue, 'text/html');
            const nodes = $generateNodesFromDOM(editor, dom);
            root.select();
            $insertNodes(nodes);
        });
    }, [editor, initialValue]);

    // Reflect the `disabled` prop on the editor instance.
    React.useEffect(() => {
        editor.setEditable(!disabled);
    }, [editor, disabled]);

    const handleChange = React.useCallback(
        (_state: EditorState) => {
            editor.read(() => {
                const html = $generateHtmlFromNodes(editor, null);
                onChange(html);
            });
        },
        [editor, onChange]
    );

    return (
        <Box sx={{ position: 'relative', flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        style={{
                            outline: 'none',
                            padding: '12px 16px',
                            minHeight: 240,
                        }}
                    />
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
        </Box>
    );
}
