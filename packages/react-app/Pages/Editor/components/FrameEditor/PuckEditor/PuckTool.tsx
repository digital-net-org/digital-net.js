import React from 'react';
import { useFrameUrlState } from '../useFrameUrlState';
import { frameTools } from '../Tools';

export function PuckTool() {
    const { currentTool } = useFrameUrlState();

    const renderCurrentTool = React.useCallback(() => {
        const component = frameTools.find(t => t.id === currentTool?.id)?.component;
        return component ? React.createElement(component) : null;
    }, [currentTool]);

    return <React.Fragment>{renderCurrentTool()}</React.Fragment>;
}
