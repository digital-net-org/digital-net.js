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
import { $getRoot, $insertNodes, $setSelection, BLUR_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { LEXICAL_HTML_CONFIG, LEXICAL_NODES, LEXICAL_THEME } from './lexicalConfig';
import { LexicalToolbar } from './LexicalToolbar';
import { LexicalRoot } from './LexicalRoot';

const SERIALIZE_DEBOUNCE_MS = 300;

export interface DnEditorRichTextProps {
    value: string;
    onChange: (_html: string) => void;
    disabled?: boolean;
    getInitialScrollTop?: () => number;
    onScrollTopChange?: (_top: number) => void;
}

export function DnEditorRichText({
    value,
    onChange,
    disabled = false,
    getInitialScrollTop,
    onScrollTopChange,
}: DnEditorRichTextProps) {
    const initialConfig = React.useMemo(
        () => ({
            namespace: 'dn-editor-rich-text',
            theme: LEXICAL_THEME,
            nodes: LEXICAL_NODES,
            html: LEXICAL_HTML_CONFIG,
            editable: !disabled,
            onError(error: Error) {
                console.error('[DnEditorRichText] error:', error);
            },
        }),
        [disabled]
    );

    return (
        <LexicalRoot>
            <LexicalComposer initialConfig={initialConfig}>
                <LexicalToolbar disabled={disabled} />
                <EditorBody
                    initialValue={value}
                    onChange={onChange}
                    disabled={disabled}
                    getInitialScrollTop={getInitialScrollTop}
                    onScrollTopChange={onScrollTopChange}
                />
                <HistoryPlugin />
                <LinkPlugin />
                <ListPlugin />
            </LexicalComposer>
        </LexicalRoot>
    );
}

interface EditorBodyProps extends Pick<DnEditorRichTextProps, 'getInitialScrollTop' | 'onScrollTopChange'> {
    initialValue: string;
    onChange: (_html: string) => void;
    disabled: boolean;
}

function EditorBody({ initialValue, onChange, disabled, getInitialScrollTop, onScrollTopChange }: EditorBodyProps) {
    const [editor] = useLexicalComposerContext();
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const initRef = React.useRef(false);
    const serializeTimerRef = React.useRef<number | null>(null);
    // Guards against a slower Prettier pass overwriting the result of a newer one.
    const formatSeqRef = React.useRef(0);

    const onChangeRef = React.useRef(onChange);
    React.useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

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
            // Leaving the caret at the end makes the browser scroll the freshly mounted editor
            // down to it, so drop the selection once the content is in.
            $setSelection(null);
        });
    }, [editor, initialValue]);

    // Hydration fills the editor asynchronously, so wait until there is enough content to scroll.
    React.useEffect(() => {
        const scroller = scrollerRef.current;
        const top = getInitialScrollTop?.() ?? 0;
        if (!scroller || !top) return;
        const observer = new ResizeObserver(() => {
            if (scroller.scrollHeight - scroller.clientHeight < top) return;
            scroller.scrollTop = top;
            observer.disconnect();
        });
        observer.observe(scroller.firstElementChild ?? scroller);
        return () => observer.disconnect();
        // Mount-once: restoring on every render would fight the user's own scrolling.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => void editor.setEditable(!disabled), [editor, disabled]);

    const serializeNow = React.useCallback(() => {
        if (serializeTimerRef.current !== null) {
            window.clearTimeout(serializeTimerRef.current);
            serializeTimerRef.current = null;
        }
        const html = editor.read(() => $generateHtmlFromNodes(editor, null));
        const seq = ++formatSeqRef.current;
        void (async () => {
            // Lexical exports minified HTML; run it through the same Prettier pass as the
            // code editor so the persisted content stays clean regardless of the editor used.
            const { formatCode } = await import('../format/formatCode');
            const formatted = await formatCode(html, 'html');
            if (seq === formatSeqRef.current) onChangeRef.current(formatted);
        })();
    }, [editor]);

    const handleChange = React.useCallback(() => {
        if (serializeTimerRef.current !== null) window.clearTimeout(serializeTimerRef.current);
        serializeTimerRef.current = window.setTimeout(serializeNow, SERIALIZE_DEBOUNCE_MS);
    }, [serializeNow]);

    React.useEffect(
        () =>
            editor.registerCommand(
                BLUR_COMMAND,
                () => {
                    serializeNow();
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
        [editor, serializeNow]
    );

    // Drop any pending timer on unmount blur has already flushed the latest value
    React.useEffect(
        () => () => (serializeTimerRef.current !== null ? window.clearTimeout(serializeTimerRef.current) : void 0),
        []
    );

    return (
        <Box
            ref={scrollerRef}
            onScroll={event => onScrollTopChange?.(event.currentTarget.scrollTop)}
            sx={{ position: 'relative', flex: 1, minHeight: 0, overflowY: 'auto' }}
        >
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
