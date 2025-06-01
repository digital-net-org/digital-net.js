import React from 'react';
import { type PagePuckConfigPayload } from '@digital-net/core';
import { type DialogProps, Dialog, Form, InputText, InputFile, Button } from '@digital-net/react-digital-ui';
import { Localization } from '../../../../Localization';
import { usePuckConfigApi } from './usePuckConfigApi';

export interface PuckConfigFormProps {
    open: DialogProps['open'];
    onClose: DialogProps['onClose'];
    loading?: DialogProps['loading'];
}

export function PuckConfigForm({ onClose, ...dialogProps }: PuckConfigFormProps) {
    const { uploadConfig, isUploading } = usePuckConfigApi({
        onUpload: () => handleClose(),
    });

    const [formState, setFormState] = React.useState<Partial<PagePuckConfigPayload>>({});
    const setFile = (v: Array<File> | undefined) => setFormState(prev => ({ ...prev, file: v?.[0] }));
    const setVersion = (v: string | undefined) => setFormState(prev => ({ ...prev, version: v }));

    const handleClose = React.useCallback(() => {
        setFormState({});
        onClose?.();
    }, [onClose]);

    const handleSubmit = React.useCallback(() => uploadConfig(formState), [formState, uploadConfig]);

    return (
        <Dialog onClose={handleClose} {...dialogProps}>
            <Dialog.Header>
                {Localization.translate(`app-settings:pages.pages-puck.actions.create.label`)}
            </Dialog.Header>
            <Dialog.Content>
                <Form id="create-version-form" onSubmit={handleSubmit} gap={2} align="end">
                    <InputText
                        type="text"
                        help={Localization.translate(
                            'app-settings:pages.pages-puck.actions.create.form.version:pattern'
                        )}
                        value={formState.version ?? ''}
                        onChange={setVersion}
                        label={Localization.translate(
                            'app-settings:pages.pages-puck.actions.create.form.version:label'
                        )}
                        loading={isUploading}
                        pattern="^[A-Za-z0-9._\-]{3,24}$"
                        focusOnMount
                        required
                    />
                    <InputFile
                        value={formState.file ? [formState.file] : []}
                        onChange={setFile}
                        label={Localization.translate('app-settings:pages.pages-puck.actions.create.form.file:label')}
                        accept={['application/javascript', 'text/javascript', 'application/x-javascript']}
                        required
                    />
                    <Button disabled={!formState.file} loading={isUploading}>
                        {Localization.translate('global:actions.import')}
                    </Button>
                </Form>
            </Dialog.Content>
        </Dialog>
    );
}
