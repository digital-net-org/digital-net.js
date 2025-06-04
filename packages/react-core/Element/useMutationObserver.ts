import React from 'react';

type MutationCallback = (mutations: MutationRecord[]) => void;

export function useMutationObserver(
    element: HTMLElement | null,
    callback: MutationCallback,
    options?: MutationObserverInit
) {
    const callbackRef = React.useRef(callback);
    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const resolvedOptions = React.useMemo(
        () => options ?? { childList: true, subtree: true, attributes: true },
        [options]
    );

    React.useEffect(() => {
        if (!element) return;

        const observer = new MutationObserver(mutations => {
            callbackRef.current(mutations);
        });

        observer.observe(element, resolvedOptions);
        return () => observer.disconnect();
    }, [element, resolvedOptions]);
}
