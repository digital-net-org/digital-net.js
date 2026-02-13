import { type ThemeOptions } from '@mui/material/styles';

export const shape: Pick<ThemeOptions, 'shape' | 'spacing' | 'breakpoints' | 'direction'> = {
    shape: {
        borderRadius: '0.25rem',
    },
    spacing: 8,
};
