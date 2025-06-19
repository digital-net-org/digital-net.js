import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Dialog, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { useEditorContext, usePageStore } from '../state';
import { EditorHelper } from './EditorHelper';

export function EditorDialogs() {
    const { id } = useParams();
    const { delete: localDelete } = usePageStore();
    const { isReloadPopupOpen, toggleLayoutLoading, toggleReloadPopup } = useEditorContext();

    const reloadPage = React.useCallback(async () => {
        await localDelete(id);
        toggleLayoutLoading();
        toggleReloadPopup();
    }, [id, localDelete, toggleLayoutLoading, toggleReloadPopup]);

    return (
        <Dialog
            open={isReloadPopupOpen}
            onClose={toggleReloadPopup}
            className={`${EditorHelper.className}-ReloadPopup`}
        >
            <Dialog.Header>
                <Text variant="caption">{Localization.translate('page-editor:alerts.reload.title')}</Text>
            </Dialog.Header>
            <Dialog.Content>
                <Box gap={2}>
                    <Text>{Localization.translate('page-editor:alerts.reload.content')}</Text>
                    <Box fullWidth gap={1} justify="end" direction="row">
                        <Button onClick={reloadPage}>{Localization.translate('global:confirm')}</Button>
                        <Button critical onClick={toggleReloadPopup}>
                            {Localization.translate('global:cancel')}
                        </Button>
                    </Box>
                </Box>
            </Dialog.Content>
        </Dialog>
    );
}
