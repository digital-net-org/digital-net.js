import React from 'react';
import { Box } from '@digital-net/react-digital-ui';
import { useEditorContext } from '../../state';
import { EditorHelper } from '../EditorHelper';
import { Actions } from './Actions';

export function EditorToolbar() {
    const { selectedTool, selectTool, isPanelOpen, togglePanel } = useEditorContext();
    return (
        <div className={`${EditorHelper.className}-ToolBar-Custom`}>
            <Actions
                actions={[
                    {
                        onClick: togglePanel,
                        selected: isPanelOpen,
                        icon: 'FolderIcon',
                    },
                ]}
            />
            <Box className="Editor-ToolBar-separator" />
            {
                <Actions
                    actions={[
                        {
                            icon: 'DiamondIcon',
                            selected: selectedTool === 'components',
                            onClick: () => selectTool('components'),
                        },
                        {
                            icon: 'DiagramIcon',
                            selected: selectedTool === 'tree',
                            onClick: () => selectTool('tree'),
                        },
                    ]}
                />
            }
        </div>
    );
}
