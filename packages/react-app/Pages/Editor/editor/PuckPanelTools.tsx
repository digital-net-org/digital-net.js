import React from 'react';
import { Puck } from '@measured/puck';
import { Box, type IconButtonProps, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { type EditorToolKey, useEditorContext } from '../state';
import { Actions } from './components';
import { EditorHelper } from './EditorHelper';

export const baseToolClassName = `${EditorHelper.className}-Tool`;

export function PuckPanelTools() {
    const { page, selectedTool, selectTool, isLayoutLoading } = useEditorContext();

    return (
        <Box className={baseToolClassName} fullHeight>
            <Box direction="row" justify="space-between" align="center" gap={1} fullWidth>
                <Box p={1} gap={1} fullWidth direction="row" justify="space-between" align="center">
                    {selectedTool ? (
                        <Text variant="caption">
                            {Localization.translate(`page-editor:tools.${selectedTool}.title`)}
                        </Text>
                    ) : (
                        <div></div>
                    )}
                    <Actions
                        actions={(
                            [
                                { icon: 'DiamondIcon', id: 'components' },
                                { icon: 'DiagramIcon', id: 'tree' },
                            ] satisfies Array<{ icon: IconButtonProps['icon']; id: EditorToolKey }>
                        ).map(({ id, icon }) => ({
                            icon,
                            selected: selectedTool === id,
                            disabled: !page || isLayoutLoading,
                            onClick: () => (id !== selectedTool ? selectTool(id) : void 0),
                        }))}
                    />
                </Box>
            </Box>
            <Box className={`${baseToolClassName}-Render`} p={1} fullWidth fullHeight>
                {isLayoutLoading ? null : (
                    <div className={`${baseToolClassName}-${selectedTool}`}>
                        {selectedTool === 'components' && <Puck.Components />}
                        {selectedTool === 'tree' && <Puck.Outline />}
                    </div>
                )}
            </Box>
        </Box>
    );
}
