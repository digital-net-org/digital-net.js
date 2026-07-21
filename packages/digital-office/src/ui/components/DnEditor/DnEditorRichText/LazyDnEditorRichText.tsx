import * as React from 'react';
import { DnLoadingView } from '../../DnLoadingView';
import type { DnEditorRichTextProps } from './DnEditorRichText';

const DnEditorRichTextImpl = React.lazy(() =>
    import('./DnEditorRichText').then(m => ({ default: m.DnEditorRichText }))
);

export function LazyDnEditorRichText(props: DnEditorRichTextProps) {
    return (
        <React.Suspense fallback={<DnLoadingView />}>
            <DnEditorRichTextImpl {...props} />
        </React.Suspense>
    );
}
