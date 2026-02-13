import { type PaletteOptions } from '@mui/material/styles';

const basePalette: PaletteOptions = {
    primary: {
        main: '#004aad',
        light: '#2c6fc7',
    },
    error: {
        main: '#b62929',
        light: '#c74545',
    },
};

export const lightPalette: PaletteOptions = {
    ...basePalette,
    mode: 'light',
    background: {
        default: '#f0f0f0',
        paper: '#fcfcfc',
    },
    text: {
        primary: '#222222',
        secondary: '#2d2d2d',
        disabled: '#707070',
    },
    divider: '#707070',
};

export const darkPalette: PaletteOptions = {
    ...basePalette,
    mode: 'dark',
    background: {
        default: '#181818',
        paper: '#222222',
    },
    text: {
        primary: '#f0f0f0',
        secondary: '#d0d0d0',
        disabled: '#707070',
    },
    divider: '#707070',
};
