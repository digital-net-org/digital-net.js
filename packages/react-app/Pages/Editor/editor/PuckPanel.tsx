import React from 'react';
import { Resizable } from 're-resizable';
import { useElement } from '@digital-net/react-core';
import { Box } from '@digital-net/react-digital-ui';
import { useEditorContext, useEditorLayoutState } from '../state';
import { EditorHelper } from './EditorHelper';
import { PuckPanelFields } from './PuckPanelFields';
import { PuckPanelTools } from './PuckPanelTools';
import { usePuckEditorKey } from './usePuckEditorKey';

export function PuckPanel() {
    const { isLayoutLoading } = useEditorContext();
    const { toolHeight, setToolHeight } = useEditorLayoutState();
    const key = usePuckEditorKey();

    const parentRef = React.useRef<HTMLDivElement>(null);
    const { element: parentElement } = useElement(parentRef);
    const maxToolHeight = React.useMemo(() => (parentElement?.clientHeight ?? 0) / 1.5, [parentElement?.clientHeight]);

    return (
        <Box key={key} ref={parentRef} fullHeight>
            <Resizable
                className={`${EditorHelper.className}-Right-Panel-Top`}
                enable={{ bottom: true }}
                minHeight={64}
                maxHeight={maxToolHeight}
                size={{ width: '100%', height: toolHeight }}
                onResize={setToolHeight}
            >
                {isLayoutLoading ? null : <PuckPanelFields />}
            </Resizable>
            <PuckPanelTools />
        </Box>
    );
}
