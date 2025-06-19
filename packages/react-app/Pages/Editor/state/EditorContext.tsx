import React from 'react';
import { useParams } from 'react-router-dom';
import type { Page } from '@digital-net/core';
import { type EditorUrlState, useEditorUrl } from './useEditorUrl';
import { useEditorCrud } from './useEditorCrud';
import { useEditorDialogState } from './useEditorDialogState';
import { useEditorLoaderState } from './useEditorLoaderState';
import { useIsPageModified } from './useIsPageModified';
import { usePageStore } from '@digital-net/react-app/Pages/Editor/state/usePageStore';

interface EditorContextProps extends EditorUrlState, ReturnType<typeof useEditorCrud> {
    isModified: boolean;
    isReloadPopupOpen: boolean;
    isLayoutLoading: boolean;
    toggleLayoutLoading: () => void;
    toggleReloadPopup: () => void;
}

const defaultEditorContext: EditorContextProps = {
    isPanelOpen: false,
    selectedTool: undefined,
    selectTool: () => void 0,
    togglePanel: () => void 0,
    page: undefined,
    pageList: [],
    isLoading: false,
    isLayoutLoading: false,
    isModified: false,
    isReloadPopupOpen: false,
    toggleReloadPopup: () => void 0,
    toggleLayoutLoading: () => void 0,
    handleCreate: async () => void 0,
    handleDelete: async () => void 0,
    handlePatch: async () => void 0,
    reload: async () => void 0,
};

export const EditorContext = React.createContext<EditorContextProps>(defaultEditorContext);

export function EditorContextProvider({ children }: React.PropsWithChildren) {
    const { id } = useParams();
    const { isModified } = useIsPageModified(id);
    const { page: crudPage, ...crud } = useEditorCrud();
    const { get: localGet } = usePageStore();
    const editorUrlState = useEditorUrl();
    const editorDialogState = useEditorDialogState();
    const editorLoaderState = useEditorLoaderState();

    const [page, setPage] = React.useState<Page | undefined>();
    React.useEffect(() => {
        (async () => setPage(crudPage ? ((await localGet(id)) ?? crudPage) : undefined))();
    }, [id, localGet, crudPage]);

    return (
        <EditorContext.Provider
            value={{
                ...editorLoaderState,
                ...editorUrlState,
                ...crud,
                ...editorDialogState,
                page,
                isModified,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

export function useEditorContext() {
    return React.useContext(EditorContext);
}
