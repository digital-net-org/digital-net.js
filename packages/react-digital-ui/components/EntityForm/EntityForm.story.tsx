/* eslint react-hooks/rules-of-hooks: 0 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import type { Entity } from '@digital-net/core';
import { Box } from '../Box';
import EntityForm, { type EntityFormProps } from './EntityForm';
import { type TestEntity, testEntity, testSchema } from './EntityForm.story.helper';

const meta: Meta<EntityFormProps<Entity>> = {
    title: 'Inputs/EntityForm',
    component: EntityForm,
};

type Story = StoryObj<typeof meta>;
export default meta;

export const StateTests: Story = {
    decorators: () => {
        const [value, setValue] = React.useState<TestEntity>(testEntity);
        const onSubmit = () => console.log('submit');

        return (
            <Box gap={2}>
                <EntityForm id="test" value={value} onChange={setValue} onSubmit={onSubmit} schema={testSchema} />
                <button type="submit" form="test">
                    Submit
                </button>
                <Box>
                    Submit content:
                    <pre>{JSON.stringify(value, null, 2)}</pre>
                </Box>
            </Box>
        );
    },
    args: {},
};
