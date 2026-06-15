import * as React from 'react';
import { DnLoadingView } from '../DnLoadingView';
import type { DnInputCodeProps } from './DnInputCode';

const DnInputCodeImpl = React.lazy(() => import('./DnInputCode').then(m => ({ default: m.DnInputCode })));

export function DnInputCode(props: DnInputCodeProps) {
    return (
        <React.Suspense fallback={<DnLoadingView />}>
            <DnInputCodeImpl {...props} />
        </React.Suspense>
    );
}
