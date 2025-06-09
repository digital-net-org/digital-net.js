import React from 'react';
import { type IconButtonProps, Box, IconButton } from '@digital-net/react-digital-ui';

interface ActionsProps {
    actions: Array<IconButtonProps>;
}

export function Actions({ actions }: ActionsProps) {
    return (
        <Box direction="row" align="center" gap={1}>
            {actions.map(props => (
                <React.Fragment key={props.icon}>
                    <IconButton {...props} />
                </React.Fragment>
            ))}
        </Box>
    );
}
