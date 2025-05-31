import React from 'react';
import { useDigitalQuery } from '@digital-net/react-digital-client';
import { Box, Form, IconButton, InputText } from '@digital-net/react-digital-ui';
import { Localization } from '../../../../../Localization';
import { SubmitDialog } from './SubmitDialog';
import { digitalEndpoints } from '@digital-net/core';

const defaultState = '*********';
const allowedSymboles = '!"#$%&\'()*+-./:;<=>?@[\\]^_{|}~';

export function PasswordField() {
    const { data: pattern } = useDigitalQuery<string>(digitalEndpoints['validation/pattern/password']);

    const [newPassword, setNewPassword] = React.useState<string | undefined>(defaultState);
    const [confirmPassword, setConfirmPassword] = React.useState<string | undefined>();
    const [isEditing, setIsEditing] = React.useState(false);
    const [isConfirming, setIsConfirming] = React.useState(false);

    const handleSubmit = () => setIsConfirming(true);

    const handleCancel = () => {
        setIsEditing(false);
        setIsConfirming(false);
        setNewPassword(defaultState);
        setConfirmPassword('');
    };

    const handleSetEdit = () => {
        setIsEditing(true);
        setNewPassword('');
    };

    return (
        <React.Fragment>
            <SubmitDialog payload={newPassword} onCancel={handleCancel} open={isConfirming} />
            <Form id="update-password" onSubmit={handleSubmit} gap={1}>
                <Box direction="row" align="end" gap={1} fullWidth>
                    <InputText
                        type="password"
                        value={newPassword}
                        onChange={setNewPassword}
                        label={Localization.translate('app:settings.user.account.form.security.password.label')}
                        help={Localization.translate('app:settings.user.account.form.security.password.pattern', {
                            symboles: allowedSymboles,
                        })}
                        pattern={pattern}
                        disabled={!isEditing}
                        required
                    />
                    {isEditing ? (
                        <Box direction="row">
                            <IconButton type="submit" icon="CheckIcon" />
                            <IconButton icon="CloseIcon" critical onClick={handleCancel} />
                        </Box>
                    ) : (
                        <IconButton icon="PencilSquare" onClick={handleSetEdit} />
                    )}
                </Box>
                {isEditing && (
                    <InputText
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        label={Localization.translate('app:settings.user.account.form.security.password.labelConfirm')}
                        help={Localization.translate('app:settings.user.account.form.security.password.pattern', {
                            symboles: allowedSymboles,
                        })}
                        pattern={newPassword}
                        disableAdornment
                        required
                    />
                )}
            </Form>
        </React.Fragment>
    );
}
