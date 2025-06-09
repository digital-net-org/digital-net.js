import React from 'react';
import { useEditorContext, type EditorToolKey } from '../state';
import { ToolTree, ToolComponents } from './components';

export function PuckTool() {
    const { selectedTool } = useEditorContext();
    const renderCurrentTool = React.useCallback(() => {
        return selectedTool
            ? React.createElement(
                  (
                      {
                          tree: ToolTree,
                          components: ToolComponents,
                      } satisfies Record<EditorToolKey, () => React.JSX.Element>
                  )[selectedTool]
              )
            : null;
    }, [selectedTool]);

    return <React.Fragment>{renderCurrentTool()}</React.Fragment>;
}
