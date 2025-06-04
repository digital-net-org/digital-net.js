import React from 'react';
import { Spacing } from '../../core/Spacing';
import { useResizeObserver } from './useResizeObserver';
import { useWindow } from './useWindow';

export function useElementSpacing<T extends HTMLElement>(element: T | null) {
    const [padding, setPadding] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 });
    const [margin, setMargin] = React.useState({ top: 0, right: 0, bottom: 0, left: 0 });
    const windowState = useWindow();

    useResizeObserver(element, () => {
        if (!element || !window) return;
        setPadding(Spacing.getPadding(element));
        setMargin(Spacing.getMargin(element));
    });

    React.useLayoutEffect(() => {
        if (!element || !window) return;
        setPadding(Spacing.getPadding(element));
        setMargin(Spacing.getMargin(element));
    }, [element, windowState]);

    return { padding, margin };
}
