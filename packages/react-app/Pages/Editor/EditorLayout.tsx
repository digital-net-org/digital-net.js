import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { EditorContextProvider } from './EditorContext';

export function EditorLayout() {
    return (
        <EditorContextProvider>
            <Outlet />
        </EditorContextProvider>
    );
}
