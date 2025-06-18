import React from 'react';
import { type Data, Puck } from '@measured/puck';
import { Box, Loader, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { PuckStateProvider } from '../../../Puck';
import { useEditorContext } from '../state';
import { EditorHelper } from './EditorHelper';
import { PuckLayout } from './PuckLayout';

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
            <PuckLayout />
        </PuckStateProvider>
    );
}
