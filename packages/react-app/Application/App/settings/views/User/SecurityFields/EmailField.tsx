import React from 'react';
import { InputText } from '@digital-lib/react-digital-ui';
import { Localization } from '../../../../../../Localization';
import { useApplicationUser } from '../../../../../../User';

export function EmailField() {
    const { email } = useApplicationUser();

    return (
        <React.Fragment>
            <InputText
                label={Localization.translate('app:settings.user.account.form.security.email.label')}
                onChange={() => void 0}
                value={email}
                type="email"
                disabled
            />
        </React.Fragment>
    );
}
