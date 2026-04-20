import { type PaletteOptions } from '@mui/material/styles';

export const lightPalette: PaletteOptions = {
    mode: 'light',
    primary: {
        main: '#004aad',
        light: '#2c6fc7',
    },
    error: {
        main: '#b62929',
        light: '#c74545',
    },
    warning: {
        main: '#004aad',
        light: '#2c6fc7',
    },
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
    mode: 'dark',
    primary: {
        main: '#2f69b2',
        light: '#6191cf',
    },
    error: {
        main: '#c14141',
        light: '#c85959',
    },
    warning: {
        main: '#2f69b2',
        light: '#6191cf',
    },
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
