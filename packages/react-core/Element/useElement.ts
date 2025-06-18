import React from 'react';
import { useElementSpacing } from './useElementSpacing';
import { useElementPosition } from './useElementPosition';

export function useElement<T extends HTMLElement>(element: React.RefObject<T | null> | HTMLElement | string | null) {
    const [state, setState] = React.useState<T | null>(null);

    React.useLayoutEffect(() => {
        if (!element) {
            return;
        } else if (typeof element === 'string') {
            return setState(document.getElementById(element) as T);
        } else if (element instanceof HTMLElement) {
            setState(element as T);
        } else {
            setState(element.current);
        }
    }, [element]);

    const mutateStyle = React.useCallback(
        (style: Partial<CSSStyleDeclaration>) => (state ? Object.assign(state.style, style) : void 0),
        [state]
    );

    const spacingState = useElementSpacing(state);
    const rectState = useElementPosition(state);

    return {
        element: state,
        id: state?.id,
        className: state?.className,
        getChildren: () => state?.children ?? [],
        mutateStyle,
        ...spacingState,
        ...rectState,
    };
}
