import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { MoonIcon, SunIcon } from '@storybook/icons';

const ADDON_ID = 'dn-theme-addon';
const TOOL_ID = 'dn-theme-tool';

addons.register(ADDON_ID, () => {
    addons.add(TOOL_ID, {
        type: types.TOOL,
        title: 'Switch Theme',
        match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
        render: () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [globals, updateGlobals] = useGlobals();
            const isDark = globals.theme === 'dark';

            const toggleTheme = () => updateGlobals({ theme: isDark ? 'light' : 'dark' });

            return (
                <IconButton key={TOOL_ID} active={isDark} title="Basculer le thème" onClick={toggleTheme}>
                    {isDark ? <MoonIcon /> : <SunIcon />}
                </IconButton>
            );
        },
    });
});
