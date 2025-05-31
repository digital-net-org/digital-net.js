import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');

export const digitalLibConstants = {
    APP_VERSION: env.APP_VERSION ?? '0.0.0',
    APP_ROOT: 'root',
    DIGITAL_API_URL: env.DIGITAL_API_URL,

    STORAGE_KEY_AUTH: 'data-user',
    STORAGE_KEY_THEME: 'data-theme',

    ROUTER_HOME: '/',
    ROUTER_LOGIN: '/login',
    ROUTER_EDITOR: '/editor',
};
