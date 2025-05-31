import { type Namespace } from '../Localization';

export default {
    namespace: 'app',
    fr: {
        global: {
            confirm: 'Confirmer',
            import: 'Importer',
        },
        navigation: {
            label: 'Navigation',
        },
        alerts: {
            errors: {
                noFrameValidation: {
                    noFrame: 'Aucune librairie de composants',
                    action: 'Cliquez pour importer une librairie.',
                    invalid:
                        "La librarie {{ version }} n'est pas valide. Le fichier doit être au format ESM renvoyer un export default.",
                    unhandled:
                        'Une erreur est survenue lors de la validation des librairies de composants. Veuillez contacter votre administrateur.',
                },
            },
        },
    },
    en: {
        global: {
            confirm: 'Confirm',
            import: 'Import',
        },
        navigation: {
            label: 'Navigation',
        },
        alerts: {
            errors: {
                noFrameValidation: {
                    noFrame: 'No component library',
                    action: 'Click to import a library.',
                    invalid:
                        'The library {{ version }} is invalid. The file must be in ESM format and return a default export.',
                    unhandled:
                        'An error occurred while validating component libraries. Please contact your administrator.',
                },
            },
        },
    },
} satisfies Namespace;
