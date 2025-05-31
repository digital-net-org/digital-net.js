const endpoints = [
    'authentication/user/login',
    'authentication/user/refresh',
    'authentication/user/logout',
    'authentication/user/logout-all',
    'user',
    'user/self',
    'user/schema',
    'page',
    'page/path',
    'page/schema',
    'page/asset',
    'page/asset/path',
    'page/asset/upload',
    'page/config',
    'page/config/test',
    'page/config/upload',
    'page/config/version',
    'validation/pattern/email',
    'validation/pattern/username',
    'validation/pattern/password',
    'validation/size/avatar',
] as const;
export type DigitalEndpoint = (typeof endpoints)[number];

export const digitalEndpoints: Record<DigitalEndpoint, string> = endpoints.reduce(
    (acc, key) => {
        acc[key] = `${DIGITAL_API_URL}/${key}`;
        return acc;
    },
    {} as Record<DigitalEndpoint, string>
);
