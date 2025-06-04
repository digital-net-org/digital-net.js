import React from 'react';

export function useResizeObserver<T extends HTMLElement | Window>(
    element: T | null,
    callback: (size: { width: number; height: number }) => void
) {
    const callbackRef = React.useRef(callback);
    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    React.useLayoutEffect(() => {
        if (!element) return;

        if (element instanceof Window) {
            const handleResize = () => callbackRef.current({ width: element.innerWidth, height: element.innerHeight });
            element.addEventListener('resize', handleResize);
            handleResize();
            return () => element.removeEventListener('resize', handleResize);
        }

        const resizeObserver = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            callbackRef.current({ width, height });
        });
        resizeObserver.observe(element);
        return () => resizeObserver.disconnect();
    }, [element]);
}
