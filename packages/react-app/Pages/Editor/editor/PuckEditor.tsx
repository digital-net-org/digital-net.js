import React from 'react';
import { type Data, Puck } from '@measured/puck';
import { Box, Loader } from '@digital-net/react-digital-ui';
import { usePuckConfig } from './usePuckConfig';
import { useEditorContext } from '../state';
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
        return null;
    }
    return (
        <React.Fragment>
            {JSON.stringify(puckConfig?.components.Box ?? {})}
            <Puck data={EditorHelper.resolveData(page.data)} config={puckConfig} onChange={handlePuckChange}>
                <PuckTool />
                <Box direction="row" fullHeight fullWidth>
                    <Puck.Preview />
                    <Puck.Fields />
                </Box>
            </Puck>
        </React.Fragment>
    );
}
