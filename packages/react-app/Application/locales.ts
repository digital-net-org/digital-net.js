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
                puckConfigValidation: {
                    notFound: 'Aucune librairie de composants',
                    action: 'Cliquez pour importer une librairie.',
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
                puckConfigValidation: {
                    notFound: 'No component library',
                    action: 'Click to import a library.',
                    unhandled:
                        'An error occurred while validating component libraries. Please contact your administrator.',
                },
            },
        },
    },
} satisfies Namespace;
