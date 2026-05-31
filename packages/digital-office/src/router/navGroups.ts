export const DigitalOfficeNavGroup = {
    ContentManager: 'Gestionnaire de contenu',
    Administration: 'Administration',
} as const;

export type DigitalOfficeNavGroup = (typeof DigitalOfficeNavGroup)[keyof typeof DigitalOfficeNavGroup];
