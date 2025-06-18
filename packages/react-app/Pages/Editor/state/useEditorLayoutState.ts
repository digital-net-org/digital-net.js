import type { ResizeCallback } from 're-resizable';
import { useLocalStorage } from '@digital-net/react-core';

export function useEditorLayoutState() {
    const [previewState, setPreviewState] = useLocalStorage<Record<'width' | 'height', number | string>>(
        'EDITOR_LAYOUT_PREVIEW',
        {
            width: '100%',
            height: '100%',
        }
    );
    const handlePreviewResize: ResizeCallback = (_, __, { offsetHeight, offsetWidth }) =>
        setPreviewState({ width: offsetWidth, height: offsetHeight });

    const [panelWidth, setPanelWidth] = useLocalStorage<number>('EDITOR_LAYOUT_PANEL_0', 300);
    const handlePanelResize: ResizeCallback = (_, __, { offsetWidth }) => setPanelWidth(offsetWidth);
    const [tool1Height, setTool1Height] = useLocalStorage<number | string>('EDITOR_LAYOUT_PANEL_1', '100%');
    const handleTool1State: ResizeCallback = (_, __, { offsetHeight }) => setTool1Height(offsetHeight);

    return {
        preview: previewState,
        setPreview: handlePreviewResize,
        panelWidth: panelWidth,
        setPanelWidth: handlePanelResize,
        toolHeight: tool1Height,
        setToolHeight: handleTool1State,
    };
}
