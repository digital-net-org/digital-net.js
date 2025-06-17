import React from 'react';
import { type Data, Puck } from '@measured/puck';
import { Box, Loader, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { PuckStateProvider } from '../../../Puck';
import { useEditorContext } from '../state';
import { PuckTool } from './PuckTool';
import { EditorHelper } from './EditorHelper';

export function PuckEditor() {
    const { page, isLoading, localSave } = useEditorContext();

    const handlePuckChange = async (data: Data) => {
        if (isLoading || !page) {
            return;
        }
        if (!EditorHelper.deepDataEquality(data, page.puckData)) {
            await localSave({ ...page, puckData: JSON.stringify(data) });
        }
    };

    if (isLoading) {
        return (
            <Box fullHeight fullWidth align="center" justify="center">
                <Loader size="large" />
            </Box>
        );
    }
    if (!page) {
        return (
            <Box fullHeight fullWidth align="center" pt={3}>
                <Text variant="span" italic>
                    {Localization.translate('page-editor:noneSelected')}
                </Text>
            </Box>
        );
    }
    return (
        <PuckStateProvider key={page.id} data={EditorHelper.resolveData(page.puckData)} onChange={handlePuckChange}>
            <Box direction="row" fullHeight fullWidth>
                <Box className={`${EditorHelper.className}-Preview`}>
                    <Puck.Preview />
                </Box>
                <Box className={`${EditorHelper.className}-Tool-Panel`}>
                    <Puck.Fields />
                    <PuckTool />
                </Box>
            </Box>
        </PuckStateProvider>
    );
}
