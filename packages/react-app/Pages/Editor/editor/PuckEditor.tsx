import React from 'react';
import { type Data, Puck } from '@measured/puck';
import { Box, Loader, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { useEditorContext } from '../state';
import { usePuckConfig } from './usePuckConfig';
import { PuckTool } from './PuckTool';
import { EditorHelper } from './EditorHelper';

export function PuckEditor() {
    const { page, isLoading, localSave, localDelete } = useEditorContext();
    const { puckConfig } = usePuckConfig(page?.version);

    const handlePuckChange = async (data: Data) => {
        if (!isLoading || !page) {
            return;
        }
        if (!EditorHelper.deepDataEquality(data, page.data)) {
            await localSave({ ...page, data: JSON.stringify(data) });
        } else {
            await localDelete();
        }
    };

    if (isLoading) {
        return <Loader size="large" />;
    }
    if (!page || !puckConfig) {
        return (
            <Box fullHeight fullWidth align="center" pt={3}>
                <Text variant="span" italic>
                    {Localization.translate('page-editor:noneSelected')}
                </Text>
            </Box>
        );
    }
    return (
        <Puck data={EditorHelper.resolveData(page.data)} config={puckConfig} onChange={handlePuckChange}>
            <Box direction="row" fullHeight fullWidth>
                <Puck.Preview />
                <Box className={`${EditorHelper.className}-Tool-Panel`}>
                    <Puck.Fields />
                    <PuckTool />
                </Box>
            </Box>
        </Puck>
    );
}
