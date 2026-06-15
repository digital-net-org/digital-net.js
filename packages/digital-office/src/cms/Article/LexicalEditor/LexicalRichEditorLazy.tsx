import * as React from 'react';
import { DnLoadingView } from '../../../ui';
import type { LexicalRichEditorProps } from './LexicalRichEditor';

const LexicalRichEditorImpl = React.lazy(() =>
    import('./LexicalRichEditor').then(m => ({ default: m.LexicalRichEditor }))
);

export function LexicalRichEditor(props: LexicalRichEditorProps) {
    return (
        <React.Suspense fallback={<DnLoadingView />}>
            <LexicalRichEditorImpl {...props} />
        </React.Suspense>
    );
}
