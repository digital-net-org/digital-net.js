import { type TypographyVariantsOptions } from '@mui/material/styles';

export const typography: TypographyVariantsOptions = {
    fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
    ].join(','),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontSize: 14,
    h2: {
        fontSize: 28,
        fontWeight: 'normal',
    },
};
