import { type Namespace } from '../Localization';

export default {
    namespace: 'user',
    fr: {
        auth: {
            success: 'Bienvenue!',
            error: 'Vos identifiants sont invalides',
            revoked: 'Vous avez été déconnecté',
        },
    },
    en: {
        auth: {
            success: 'Hello!',
            error: 'Invalid credentials',
            revoked: 'You have been logged out',
        },
    },
} satisfies Namespace;
