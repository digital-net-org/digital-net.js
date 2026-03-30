import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@mui/material';
import { DnBreadcrumbs } from '../src';

const meta: Meta<typeof DnBreadcrumbs> = {
    title: 'Navigation/DnBreadcrumbs',
    component: DnBreadcrumbs,
    tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof DnBreadcrumbs>;

export const Default: Story = {
    args: {
        url: '/admin/users/edit',
        onClick: (path: string) => console.log('Navigate to:', path),
        labels: {},
    },
    render: args => (
        <Stack padding={4}>
            <DnBreadcrumbs {...args} />
        </Stack>
    ),
};
