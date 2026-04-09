import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@mui/material';
import { DnAppBar } from '../src';

const meta: Meta<typeof DnAppBar> = {
    title: 'Navigation/DnAppBar',
    component: DnAppBar,
    tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DnAppBar>;

export const Default: Story = {
    args: {
        url: '/home/test',
        flat: false,
    },
    render: args => (
        <Stack
            sx={{
                width: '100%',
                height: '100%',
            }}
        >
            <DnAppBar {...args} />
        </Stack>
    ),
};
