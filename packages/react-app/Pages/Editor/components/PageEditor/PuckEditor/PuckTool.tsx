import React from 'react';
import { usePageUrlState } from '../usePageUrlState';
import { pageTools } from '../Tools';

export function PuckTool() {
    const { currentTool } = usePageUrlState();

    const renderCurrentTool = React.useCallback(() => {
        const component = pageTools.find(t => t.id === currentTool?.id)?.component;
        return component ? React.createElement(component) : null;
    }, [currentTool]);

    return <React.Fragment>{renderCurrentTool()}</React.Fragment>;
}
