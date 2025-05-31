import React from 'react';
import { useElement, useWindow } from '@digital-net/core';
import { type PopOverProps } from './PopOver';

type Element = HTMLElement | null;

export function useAnchor(
    anchor: Element,
    placeholder: Element,
    dialog: Element,
    background: Element,
    options?: {
        direction?: PopOverProps['direction'];
        includeAnchor?: PopOverProps['includeAnchor'];
    }
) {
    const windowState = useWindow();
    const anchorState = useElement(anchor);
    const dialogState = useElement(dialog);
    const backgroundState = useElement(background);
    const placeholderState = useElement(placeholder);

    React.useEffect(() => {
        placeholderState.mutateStyle({
            display: options?.includeAnchor ? 'block' : 'none',
            minWidth: `${anchorState.width}px`,
            height: `${anchorState.height}px`,
            marginBottom: `${dialogState.padding.bottom}px`,
        });
    }, [dialogState, anchorState, placeholderState, options?.includeAnchor]);

    React.useEffect(() => {
        if (options?.includeAnchor) return;
        dialogState.mutateStyle({
            top: `${anchorState.bottom}px`,
            left: !options?.direction || options?.direction === 'left' ? `${anchorState.left}px` : 'unset',
            right: options?.direction === 'right' ? `${windowState.width - anchorState.right}px` : 'unset',
        });
    }, [anchorState, dialogState, backgroundState, windowState, options]);

    React.useLayoutEffect(() => {
        if (!options?.includeAnchor) return;
        dialogState.mutateStyle({
            zIndex: `${anchorState.zIndex - 1}`,
            top: `${anchorState.top - dialogState.padding.top}px`,
            left:
                !options?.direction || options?.direction === 'left'
                    ? `${anchorState.left - dialogState.padding.left}px`
                    : `${anchorState.right - dialogState.width + dialogState.padding.right}px`,
            right:
                options?.direction === 'right'
                    ? `${anchorState.right - (anchorState.width + dialogState.padding.right)}px`
                    : `${windowState.width - anchorState.right - dialogState.padding.right}px`,
        });
        backgroundState.mutateStyle({
            zIndex: `${anchorState.zIndex - 2}`,
        });
    }, [anchorState, dialogState, backgroundState, windowState, options]);
}
