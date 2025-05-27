import { type Namespace } from './Namespaces/Namespace';

export default {
    namespace: 'global',
    fr: {
        errors: {
            unhandled: 'Une erreur est survenue',
        },
        actions: {
            confirm: 'Confirmer',
            import: 'Importer',
            validate: 'Valider',
            save: 'Enregistrer',
            cancel: 'Annuler',
            delete: 'Supprimer',
            duplicate: 'Dupliquer',
            auth: {
                login: 'Connexion',
                logout: 'Déconnexion',
            },
        },
        state: {
            modified: 'Modifié',
        },
    },
    en: {
        errors: {
            unhandled: 'Something went wrong',
        },
        actions: {
            confirm: 'Confirm',
            import: 'Import',
            validate: 'Confirm',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            duplicate: 'Duplicate',
            auth: {
                login: 'Login',
                logout: 'Logout',
            },
        },
        state: {
            modified: 'Modified',
        },
    },
} satisfies Namespace;
