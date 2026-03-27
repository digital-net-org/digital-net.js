import type { Meta, StoryObj } from '@storybook/react';
import { Stack, Typography } from '@mui/material';
import { DnInput } from '../src';

const meta = {
    title: 'Inputs/DnInput',
    component: DnInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof DnInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: args => (
        <Stack direction="row" alignItems="start" justifyContent="start" padding={2} gap={8}>
            {(['default', 'text'] as const).map(variant => (
                <Stack key={variant} alignItems="start" justifyContent="start" gap={4}>
                    {[{}, { disabled: true }, { error: true, helperText: 'Error message' }].map((state, i) => (
                        <Stack key={i} gap={1}>
                            <Typography component="h2">
                                {Object.keys(state).length === 0 ? 'default' : Object.keys(state)[0]}
                            </Typography>
                            <DnInput {...args} {...state} variant={variant} />
                        </Stack>
                    ))}
                </Stack>
            ))}
        </Stack>
    ),
    args: {
        label: 'Label',
        placeholder: 'Placeholder',
        loading: false,
    },
};
