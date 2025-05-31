import React from 'react';
import { type InputNavProps, InputNav, Text, Box } from '@digital-net/react-digital-ui';

interface Props extends InputNavProps {
    label: string;
}

export function AppSettingsPanelNav({ label, ...navProps }: Props) {
    return (
        <Box gap={1}>
            <Text size="xsmall" variant="caption" className="DigitalUi-AppSettings-NavSection">
                {label}
            </Text>
            <InputNav gap={1} {...navProps} />
        </Box>
    );
}
