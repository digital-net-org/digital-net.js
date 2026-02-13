import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography } from '@mui/material';
import { DnSwitch } from '../src';

const meta = {
    title: 'Inputs/DnSwitch',
    component: DnSwitch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DnSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: args => (
        <Stack direction="row" alignItems="start" justifyContent="start" padding={2} gap={8}>
            <Stack alignItems="start" justifyContent="start" gap={4}>
                {[{}, { loading: true }, { disabled: true }].map((state, i) => (
                    <Stack key={i} gap={1}>
                        <Typography component="h2">
                            {Object.keys(state).length === 0 ? 'default' : Object.keys(state)[0]}
                        </Typography>
                        <div>
                            <DnSwitch {...args} {...state} />
                        </div>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    ),
    args: {},
};
