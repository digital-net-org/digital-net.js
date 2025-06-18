import React from 'react';
import { Resizable } from 're-resizable';
import { Puck } from '@measured/puck';
import { Box } from '@digital-net/react-digital-ui';
import { useElement } from '@digital-net/react-core';
import { useEditorLayoutState } from '../state';
import { PuckPanel } from './PuckPanel';
import { EditorHelper } from './EditorHelper';

export function PuckLayout() {
    const { preview, setPreview, panelWidth, setPanelWidth } = useEditorLayoutState();
    const parentRef = React.useRef<HTMLDivElement>(null);
    const previewRef = React.useRef<HTMLDivElement>(null);
    const { element: parentElement } = useElement(parentRef);
    const { padding } = useElement(previewRef);

    const maxPreviewWidth = React.useMemo(
        () => (parentElement?.clientWidth ?? 0) - (padding.left + padding.right + (panelWidth ?? 0)),
        [parentElement?.clientWidth, panelWidth, padding.left, padding.right]
    );

    const maxPreviewHeight = React.useMemo(
        () => (parentElement?.clientHeight ?? 0) - (padding.top + padding.bottom),
        [parentElement?.clientHeight, padding.top, padding.bottom]
    );

    return (
        <Box ref={parentRef} direction="row" fullHeight fullWidth>
            <Box ref={previewRef} className={`${EditorHelper.className}-Preview`} fullHeight fullWidth>
                <Resizable
                    enable={{ right: true, bottom: true, bottomRight: true }}
                    grid={[8, 8]}
                    maxWidth={maxPreviewWidth}
                    maxHeight={maxPreviewHeight}
                    size={preview}
                    onResize={setPreview}
                >
                    <Puck.Preview />
                </Resizable>
            </Box>
            <Resizable
                enable={{ left: true }}
                grid={[8, 8]}
                minWidth={280}
                maxWidth={600}
                size={{ width: panelWidth, height: '100%' }}
                onResize={setPanelWidth}
            >
                <PuckPanel />
            </Resizable>
        </Box>
    );
}
