import type { ThemeOptions } from '@mui/material/styles';

export const components: ThemeOptions['components'] = {
    MuiButton: {
        defaultProps: {
            variant: 'contained',
            size: 'small',
        },
    },
};
