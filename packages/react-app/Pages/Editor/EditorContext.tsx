import React from 'react';

interface EditorContextProps {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const defaultEditorContext: EditorContextProps = {
    isLoading: false,
    setIsLoading: () => void 0,
};

export const EditorContext = React.createContext<EditorContextProps>(defaultEditorContext);

export function EditorContextProvider({ children }: React.PropsWithChildren) {
    const [isLoading, setIsLoading] = React.useState<boolean>(defaultEditorContext.isLoading);
    return <EditorContext.Provider value={{ isLoading, setIsLoading }}>{children}</EditorContext.Provider>;
}

export function useEditorContext() {
    return React.useContext(EditorContext);
}
