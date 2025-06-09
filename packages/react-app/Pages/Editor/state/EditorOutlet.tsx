import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { EditorContextProvider } from './EditorContext';

export function EditorOutlet() {
    return (
        <EditorContextProvider>
            <Outlet />
        </EditorContextProvider>
    );
}
