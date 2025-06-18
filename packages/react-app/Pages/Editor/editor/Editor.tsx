import React from 'react';
import { Box, Text } from '@digital-net/react-digital-ui';
import { useEditorContext, useEditorLayoutState } from '../state';
import { EditorNav, EditorTitle, Actions } from './components';
import { EditorHelper } from './EditorHelper';
import { PuckEditor } from './PuckEditor';
import './Editor.Puck.styles.css';
import './Editor.styles.css';

export function Editor() {
    const { page, togglePanel, isPanelOpen, handlePatch, handleDelete, isLoading, isModified } = useEditorContext();
    const { preview } = useEditorLayoutState();
    return (
        <div className={EditorHelper.className}>
            <div className={`${EditorHelper.className}-ToolBar`}>
                <Actions
                    actions={[
                        {
                            onClick: togglePanel,
                            selected: isPanelOpen,
                            icon: 'FolderIcon',
                        },
                    ]}
                />
                <EditorTitle />
                <div className={`${EditorHelper.className}-ToolBar-Actions`}>
                    <Text variant="caption" className={`${EditorHelper.className}-ToolBar-PreviewSize`}>
                        {preview.width} x {preview.height}
                    </Text>
                    <Box className="Editor-ToolBar-separator" />
                    <Actions
                        actions={[
                            {
                                onClick: handlePatch,
                                icon: 'FloppyIcon',
                                disabled: isLoading || !isModified || !page,
                            },
                            {
                                onClick: handleDelete,
                                icon: 'TrashIcon',
                                disabled: isLoading || !page,
                            },
                        ]}
                    />
                </div>
            </div>
            <div className={`${EditorHelper.className}-Content`}>
                <EditorNav />
                <PuckEditor />
            </div>
        </div>
    );
}
