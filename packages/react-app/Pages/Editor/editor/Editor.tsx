import React from 'react';
import { EditorActions, EditorNav, EditorTitle, EditorToolbar } from './components';
import { EditorHelper } from './EditorHelper';
import { PuckEditor } from './PuckEditor';
import './Editor.styles.css';
import './Editor.Puck.styles.css';
import './Editor.Tools.styles.css';

export function Editor() {
    return (
        <div className={EditorHelper.className}>
            <div className={`${EditorHelper.className}-ToolBar`}>
                <EditorToolbar />
                <EditorTitle />
                <EditorActions />
            </div>
            <div className={`${EditorHelper.className}-Content`}>
                <EditorNav />
                <PuckEditor />
            </div>
        </div>
    );
}
