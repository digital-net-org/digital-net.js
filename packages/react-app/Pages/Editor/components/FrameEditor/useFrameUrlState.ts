import React from 'react';
import { useUrlParams } from '@digital-net/react-app';
import { frameTools } from './Tools';

export function useFrameUrlState() {
    const [urlState, setUrlState] = useUrlParams();

    const set = React.useCallback(
        (action: 'entity' | 'tool', payload: string | number | undefined) => {
            const value = payload ? String(payload) : undefined;
            setUrlState(prev => ({ ...prev, [action]: prev[action] === value ? undefined : value }));
        },
        [setUrlState]
    );

    const reset = React.useCallback(
        () => setUrlState({ entity: undefined, tool: frameTools.find(e => e.isDefault)?.id }),
        [setUrlState]
    );

    const currentTool = React.useMemo(() => frameTools.find(e => e.id === urlState.tool), [urlState.tool]);

    const currentFrame = React.useMemo(() => urlState.entity, [urlState.entity]);

    return {
        set,
        reset,
        currentFrame,
        currentTool,
    };
}
