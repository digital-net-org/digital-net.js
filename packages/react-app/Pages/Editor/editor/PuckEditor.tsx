import React from 'react';
import { type Data, Puck } from '@measured/puck';
import { delay } from '@digital-net/core';
import { Box, Loader, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { PuckStateProvider } from '../../../Puck';
import { useEditorContext, usePageStore } from '../state';
import { EditorHelper } from './EditorHelper';
import { PuckLayout } from './PuckLayout';
import { usePuckEditorKey } from './usePuckEditorKey';

export function PuckEditor() {
    const { save } = usePageStore();
    const { page, isLoading, isLayoutLoading } = useEditorContext();
    const key = usePuckEditorKey();

    const handlePuckChange = async (data: Data) => {
        if (isLoading || !page) {
            return;
        }
        if (!EditorHelper.deepDataEquality(data, page.puckData)) {
            await save({ ...page, puckData: JSON.stringify(data) });
        }
    };

    if (isLoading || isLayoutLoading) {
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
        <PuckStateProvider key={key} data={EditorHelper.resolveData(page.puckData)} onChange={handlePuckChange}>
            <PuckLayout />
        </PuckStateProvider>
    );
}
