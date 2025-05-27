import React from 'react';
import { type InputNavProps, InputNav, Text, Box } from '@digital-lib/react-digital-ui';

export interface PanelNavProps extends InputNavProps {
    label: string;
}

export default function PanelNav({ label, ...navProps }: PanelNavProps) {
    return (
        <Box gap={1}>
            <Text size="xsmall" variant="caption" className="DigitalUi-AppSettings-NavSection">
                {label}
            </Text>
            <InputNav gap={1} {...navProps} />
        </Box>
    );
}
