/* eslint react-hooks/rules-of-hooks: 0 */
import React from 'react';
import type { StoryObj } from '@storybook/react';
import { useElement } from './useElement';
import { Box, Text } from '../../react-digital-ui';

export default { title: 'Utilities/ReactHooks' };

export const UseElement: StoryObj = {
    decorators: () => {
        const ref = React.useRef<HTMLDivElement>(null);
        const refElement = useElement(ref);
        const idElement = useElement<HTMLDivElement>('ref2');

        return (
            <Box fullWidth fullHeight direction="column">
                <Box ref={ref} id="ref1" p={2} resizable color="#cb3471">
                    <Text>REF Element:</Text>
                    <code>{JSON.stringify(refElement)}</code>
                </Box>
                <Box id="ref2" p={2} resizable color="#baebef">
                    <Text>ID Element:</Text>
                    <code>{JSON.stringify(idElement)}</code>
                </Box>
            </Box>
        );
    },
};
