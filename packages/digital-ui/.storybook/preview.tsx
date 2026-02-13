import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import { DnTheme, DnThemeProvider } from '../src';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'fullscreen',
        backgrounds: { disable: true },
    },
    globalTypes: {
        theme: { defaultValue: 'light' },
    },
    decorators: [
        (Story, context) => {
            const { theme } = context.globals;

            React.useEffect(() => {
                document.body.classList.remove('sb-main-centered');
                document.body.classList.remove('sb-show-main');
                document.body.style.margin = '0';
                document.body.style.width = '100%';
                document.body.style.height = '100%';
            }, []);

            React.useEffect(() => {
                if (theme === 'dark' || theme === 'light') {
                    DnTheme.setTheme(theme);
                }
            }, [theme]);

            return (
                <React.Fragment>
                    <DnThemeProvider>
                        <Story />
                    </DnThemeProvider>
                </React.Fragment>
            );
        },
    ],
};

export default preview;
