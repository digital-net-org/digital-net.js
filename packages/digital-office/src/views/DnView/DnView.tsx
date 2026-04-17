import * as React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { css, styled } from '@mui/material/styles';

export interface DnViewProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function DnView({ title, description, children }: DnViewProps) {
    return (
        <View>
            <Stack pb={2}>
                <Typography variant="h2">{title}</Typography>
                <Typography variant="body2" ml={0.35} mt={1}>
                    {description}
                </Typography>
            </Stack>
            <Divider />
            {children}
        </View>
    );
}

const View = styled(Stack)(
    () => css`
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    `
);
