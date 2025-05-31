import React from 'react';
import { Box, Text } from '@digital-net/react-digital-ui';
import { Localization } from '../../../../Localization';

export default function Panel({ children }: React.PropsWithChildren) {
    return (
        <Box justify="space-between" fullHeight>
            <Box gap={3} fullWidth>
                {children}
            </Box>
            <Text
                className="AppVersion"
                variant="caption"
                size="xsmall"
            >{`${Localization.translate('app:settings.version')} ${APP_VERSION}`}</Text>
        </Box>
    );
}
