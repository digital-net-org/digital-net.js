import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider, LocalizationMiddleware } from '../../packages/react-app';

export const decorators: Preview['decorators'] = (Story, context) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(
        () =>
            context.globals.theme ? document.documentElement.setAttribute('data-theme', context.globals.theme) : void 0,
        [context.globals.theme]
    );

    return (
        <main className="Page">
            <LocalizationMiddleware />
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        </main>
    );
};
