const endpoints = ['authentication/user/refresh', 'validation/pattern/password'] as const;
export type DigitalEndpoint = (typeof endpoints)[number];

export const digitalEndpoints: Record<DigitalEndpoint, string> = endpoints.reduce(
    (acc, key) => {
        acc[key] = `${DIGITAL_API_URL}/${key}`;
        return acc;
    },
    {} as Record<DigitalEndpoint, string>
);
