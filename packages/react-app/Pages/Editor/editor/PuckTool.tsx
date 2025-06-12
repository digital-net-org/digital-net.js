import React from 'react';
import { Puck } from '@measured/puck';
import { Box, type IconButtonProps, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { EditorHelper } from '../editor/EditorHelper';
import { useEditorContext, type EditorToolKey } from '../state';
import { Actions } from './components';

export const baseToolClassName = `${EditorHelper.className}-Tool`;

export function PuckTool() {
    const { page, selectedTool, selectTool } = useEditorContext();
    return (
        <Box className={baseToolClassName} fullHeight overflow="hidden">
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
                            disabled: !page,
                            onClick: () => (id !== selectedTool ? selectTool(id) : void 0),
                        }))}
                    />
                </Box>
            </Box>
            <Box className={`${baseToolClassName}-Render`} p={1} fullWidth fullHeight>
                <div className={`${baseToolClassName}-${selectedTool}`}>
                    {selectedTool === 'components' && <Puck.Components />}
                    {selectedTool === 'tree' && <Puck.Outline />}
                </div>
            </Box>
        </Box>
    );
}
