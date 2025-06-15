import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Page } from '@digital-net/core';
import { useStoredEntity } from '../../../Storage';
import { type EditorUrlState, useEditorUrl } from './useEditorUrl';
import { useEditorCrud } from './useEditorCrud';
import { EditorApiHelper } from './EditorApiHelper';

interface EditorContextProps extends EditorUrlState, ReturnType<typeof useEditorCrud> {
    isModified: boolean;
    localSave: (payload: Partial<Page>) => Promise<void>;
    localDelete: () => Promise<void>;
}

const defaultEditorContext: EditorContextProps = {
    isPanelOpen: false,
    selectedTool: undefined,
    selectTool: () => void 0,
    togglePanel: () => void 0,
    page: undefined,
    pageList: [],
    isLoading: false,
    isModified: false,
    handleCreate: async () => void 0,
    handleDelete: async () => void 0,
    handlePatch: async () => void 0,
    localSave: async () => void 0,
    localDelete: async () => void 0,
    reload: async () => void 0,
};

export const EditorContext = React.createContext<EditorContextProps>(defaultEditorContext);

export function EditorContextProvider({ children }: React.PropsWithChildren) {
    const { id } = useParams();
    const navigate = useNavigate();
    const editorUrlState = useEditorUrl();

    const { storedEntity, storedExists, saveEntity, deleteEntity } = useStoredEntity<Page>(EditorApiHelper.store, id);
    const crud = useEditorCrud({
        id,
        stored: storedEntity,
        onDelete: async () => await deleteEntity(),
        onPatch: async () => await deleteEntity(),
        onCreate: createdId => navigate({ pathname: `${ROUTER_EDITOR}/${createdId}`, search: location.search }),
    });

    const isModified = React.useMemo(() => Boolean(crud.page && storedExists), [crud.page, storedExists]);
    const page = React.useMemo(() => storedEntity ?? crud.page, [crud.page, storedEntity]);

    React.useEffect(
        () => (!id && !editorUrlState.isPanelOpen ? editorUrlState.togglePanel() : void 0),
        [editorUrlState, id]
    );

    React.useEffect(
        () => (!editorUrlState.selectedTool ? editorUrlState.selectTool('components') : void 0),
        [storedEntity, crud, editorUrlState]
    );

    return (
        <EditorContext.Provider
            value={{
                ...editorUrlState,
                ...crud,
                localDelete: deleteEntity,
                localSave: saveEntity,
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
