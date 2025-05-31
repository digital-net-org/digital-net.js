import React from 'react';
import { useUrlParams } from '@digital-net/react-app';
import { pageTools } from './Tools';

export function usePageUrlState() {
    const [urlState, setUrlState] = useUrlParams();

    const set = React.useCallback(
        (action: 'entity' | 'tool', payload: string | number | undefined) => {
            const value = payload ? String(payload) : undefined;
            setUrlState(prev => ({ ...prev, [action]: prev[action] === value ? undefined : value }));
        },
        [setUrlState]
    );

    const reset = React.useCallback(
        () => setUrlState({ entity: undefined, tool: pageTools.find(e => e.isDefault)?.id }),
        [setUrlState]
    );

    const currentTool = React.useMemo(() => pageTools.find(e => e.id === urlState.tool), [urlState.tool]);

    const currentPage = React.useMemo(() => urlState.entity, [urlState.entity]);

    return {
        set,
        reset,
        currentPage,
        currentTool,
    };
}
