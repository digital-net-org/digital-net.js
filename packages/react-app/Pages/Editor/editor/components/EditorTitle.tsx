import React from 'react';
import { Box, Icon, Loader, Text } from '@digital-net/react-digital-ui';
import { useEditorContext } from '../../state';
import { EditorHelper } from '../EditorHelper';

export function EditorTitle() {
    const { page, isLayoutLoading, isModified } = useEditorContext();

    return (
        <div className={`${EditorHelper.className}-ToolBar-Title`}>
            {page?.path && !isLayoutLoading ? (
                <Box direction="row" align="center" gap={1}>
                    <Box direction="row" align="center">
                        <Text variant="span">{page?.path}</Text>
                    </Box>
                    <Box visible={isModified}>
                        <Icon.CircleFill size="x-small" />
                    </Box>
                </Box>
            ) : null}
            {isLayoutLoading ? (
                <Box pb={1}>
                    <Loader size="small" />
                </Box>
            ) : null}
        </div>
    );
}
