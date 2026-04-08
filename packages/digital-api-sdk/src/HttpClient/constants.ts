export const DN_STORAGE_KEY = 'DN_ACCESS_TOKEN' as const;

export const DN_API_KEY_HEADER = 'DN-Api-Key' as const;

export const DN_DEFAULT_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
} as const satisfies Readonly<Record<string, string>>;
