import React from 'react';
import { useResizeObserver } from './useResizeObserver';
import { useMutationObserver } from './useMutationObserver';
import { useWindow } from './useWindow';

export function useElementPosition<T extends HTMLElement>(element: T | null) {
    const [rect, setRect] = React.useState(new DOMRect());
    const [zIndex, setZIndex] = React.useState(0);
    const windowState = useWindow();

    useMutationObserver(element, () => {
        if (!element || !window) return;
        setZIndex(parseInt(window.getComputedStyle(element).zIndex) || 0);
    });

    useResizeObserver(element, () => {
        if (!element || !window) return;
        setRect(element.getBoundingClientRect());
    });

    React.useEffect(
        () => (element ? setZIndex(parseInt(window.getComputedStyle(element).zIndex) || 0) : void 0),
        [element, windowState]
    );

    React.useLayoutEffect(() => (element ? setRect(element.getBoundingClientRect()) : void 0), [element, windowState]);

    return {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        zIndex,
    };
}
