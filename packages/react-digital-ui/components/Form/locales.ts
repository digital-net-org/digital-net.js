import { type Namespace } from '@digital-net/react-app';

export default {
    namespace: 'ui-form',
    fr: {
        validity: {
            required: 'Ce champs est requis',
            pattern: 'Le format est invalide',
            mimeType: 'Le type de fichier est invalide',
        },
    },
    en: {
        validity: {
            required: 'This field is required.',
            pattern: 'This field does not match required pattern',
            mimeType: 'The file type is invalid.',
        },
    },
} satisfies Namespace;
