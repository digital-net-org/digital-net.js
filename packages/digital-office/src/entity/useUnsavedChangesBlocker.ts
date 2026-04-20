import React from 'react';
import { useBlocker } from 'react-router';

export interface UseUnsavedChangesBlockerOptions {
    when: boolean;
}

export interface UseUnsavedChangesBlockerResult {
    isBlocked: boolean;
    confirm: () => void;
    cancel: () => void;
}

/**
 * Blocks navigation when `when` is true. Relies on React Router's `useBlocker`
 * (requires a data router created with `createBrowserRouter`) to intercept
 * in-app navigation (including programmatic `navigate()` calls and `<Link>`
 * clicks), plus a native `beforeunload` handler for tab close / reload.
 *
 * Caller is responsible for rendering a confirmation dialog based on
 * `isBlocked`, and calling `confirm()` (proceed) or `cancel()` (stay).
 */
export function useUnsavedChangesBlocker({ when }: UseUnsavedChangesBlockerOptions): UseUnsavedChangesBlockerResult {
    const blocker = useBlocker(when);

    React.useEffect(() => {
        if (!when) return;
        const handler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [when]);

    const isBlocked = blocker.state === 'blocked';

    const confirm = React.useCallback(() => {
        if (blocker.state === 'blocked') blocker.proceed();
    }, [blocker]);

    const cancel = React.useCallback(() => {
        if (blocker.state === 'blocked') blocker.reset();
    }, [blocker]);

    return { isBlocked, confirm, cancel };
}
