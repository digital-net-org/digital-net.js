import React from 'react';
import { delay } from '@digital-net/core';

export function useEditorLoaderState() {
    const [isLayoutLoading, setIsLayoutLoading] = React.useState(false);
    const toggleLayoutLoading = React.useCallback(() => setIsLayoutLoading(true), []);

    React.useEffect(() => {
        (async () => {
            if (isLayoutLoading) {
                await delay(750);
                setIsLayoutLoading(false);
            }
        })();
    }, [isLayoutLoading, toggleLayoutLoading]);

    return {
        toggleLayoutLoading,
        isLayoutLoading,
    };
}
