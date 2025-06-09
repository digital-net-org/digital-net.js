import React from 'react';
import { type Data, Puck } from '@measured/puck';
import { Box, Loader } from '@digital-net/react-digital-ui';
import { usePuckConfig } from '../../../Application';
import { useEditorContext } from '../state';
import { PuckTool } from './PuckTool';
import { EditorHelper } from './EditorHelper';

export function PuckEditor() {
    const { page, isLoading, localSave, localDelete } = useEditorContext();
    const { configs, loadedConfig } = usePuckConfig();

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
    if (!page || !loadedConfig) {
        return null;
    }
    return (
        <React.Fragment>
            {JSON.stringify(loadedConfig?.components.Box ?? {})}
            <Puck data={EditorHelper.resolveData(page.data)} config={loadedConfig} onChange={handlePuckChange}>
                <PuckTool />
                <Box direction="row" fullHeight fullWidth>
                    <Puck.Preview />
                    <Puck.Fields />
                </Box>
            </Puck>
        </React.Fragment>
    );
}
