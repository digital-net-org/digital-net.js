import type { ThemeOptions } from '@mui/material/styles';
import { darkScrollbar } from '@mui/material';

export const components: ThemeOptions['components'] = {
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                ...darkScrollbar(),
                height: '100vh',
                width: '100vw',
                overflowY: 'hidden',
                '& #root': {
                    width: '100%',
                    height: '100%',
                    overflowY: 'hidden',
                },
            },
        },
    },
    MuiButton: {
        defaultProps: {
            variant: 'contained',
        },
    },
    MuiCheckbox: {
        defaultProps: {
            disableRipple: true,
            size: 'small',
            color: 'default',
        },
    },
};
