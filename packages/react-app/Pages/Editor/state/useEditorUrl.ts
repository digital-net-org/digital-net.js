import React from 'react';
import { useUrlParams } from '@digital-net/react-app';

export type EditorToolKey = 'tree' | 'components';
export type EditorUrlKey = 'panel' | 'toolbar';

export interface EditorUrlState {
    isPanelOpen: boolean;
    selectedTool: EditorToolKey | undefined;
    selectTool: (tool: EditorToolKey) => void;
    togglePanel: () => void;
}

export function useEditorUrl(): EditorUrlState {
    const [urlState, setUrlState] = useUrlParams<Record<EditorUrlKey, string | undefined>>();

    const set = React.useCallback(
        (key: EditorUrlKey, payload: string | undefined) => {
            const value = payload ? String(payload) : undefined;
            setUrlState(prev => ({ ...prev, [key]: prev[key] === value ? undefined : value }));
        },
        [setUrlState]
    );

    const selectedTool = React.useMemo(() => urlState['toolbar'] as EditorUrlState['selectedTool'], [urlState]);
    const selectTool = React.useCallback((tool: EditorToolKey) => set('toolbar', tool), [set]);

    const isPanelOpen = React.useMemo(() => urlState['panel'] === 'open', [urlState]);
    const togglePanel = React.useCallback(() => set('panel', isPanelOpen ? undefined : 'open'), [set, isPanelOpen]);

    return {
        selectedTool,
        selectTool,
        isPanelOpen,
        togglePanel,
    };
}
