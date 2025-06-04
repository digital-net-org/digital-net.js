import React from 'react';
import { useElement } from '@digital-net/react-core';
import type { PopOverProps } from './PopOver';

export function useOnOpen(open: boolean, anchor: PopOverProps['anchor'], callback?: () => void) {
    const anchorState = useElement(anchor);
    const [hasOpened, setHasOpened] = React.useState(false);

    React.useEffect(() => {
        if (!hasOpened && open) {
            callback?.();
            setHasOpened(true);
        } else if (hasOpened && !open) {
            setHasOpened(false);
        }
    }, [hasOpened, callback, open]);

    React.useEffect(() => {
        anchorState.mutateStyle({ zIndex: open ? '1002' : 'unset' });
    }, [anchorState, open]);
}
