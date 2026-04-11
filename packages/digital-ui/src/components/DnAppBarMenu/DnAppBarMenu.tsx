import * as React from 'react';
import { Menu, type MenuProps } from '@mui/material';
import type { JSX } from 'react';

export interface DnAppBarMenuProps {
    anchorEl: MenuProps['anchorEl'];
    onClose?: () => void;
    children?: React.ReactNode;
}

export function DnAppBarMenu({ anchorEl, onClose, children }: DnAppBarMenuProps): JSX.Element {
    return (
        <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            onClose={onClose}
            slotProps={{
                paper: {
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.32))',
                        mt: 0.5,
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                },
            }}
        >
            {children}
        </Menu>
    );
}
