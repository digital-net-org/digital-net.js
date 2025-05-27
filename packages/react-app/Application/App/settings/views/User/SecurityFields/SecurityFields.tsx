import React from 'react';
import { Box, Text } from '@digital-lib/react-digital-ui';
import { Localization } from '../../../../../../Localization';

export function SecurityFields({ children }: React.PropsWithChildren) {
    return (
        <Box gap={2} fullWidth>
            <Text variant="section-title">
                {Localization.translate('app:settings.user.account.form.security.label')}
            </Text>
            {children}
        </Box>
    );
}
