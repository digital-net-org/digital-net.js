/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
    stories: ['../**/*.stories.@(js|mjs|ts)'],
    addons: ['@chromatic-com/storybook', '@storybook/addon-vitest', '@storybook/addon-a11y', '@storybook/addon-docs'],
    framework: '@storybook/web-components-vite',
};
export default config;
