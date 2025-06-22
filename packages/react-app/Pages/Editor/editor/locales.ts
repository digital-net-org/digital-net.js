import { type Namespace } from '@digital-net/react-app';

export default {
    namespace: 'page-editor',
    fr: {
        navigation: {
            title: 'Mes modèles',
        },
        tools: {
            components: {
                title: 'Composants',
            },
            tree: {
                title: 'Elements',
            },
        },
        alerts: {
            reload: {
                title: 'Recharger le modèle',
                content:
                    'Êtes-vous sûr de vouloir recharger le modèle ? Toutes les modifications non enregistrées seront perdues.',
            },
        },
        error: {
            'path-duplicate': "Ce chemin d'acces est déjà utilisé par une autre page.",
        },
        noneSelected: 'Aucun modèle sélectionné',
    },
    en: {
        navigation: {
            title: 'My Models',
        },
        tools: {
            components: {
                title: 'Components',
            },
            tree: {
                title: 'Tree',
            },
        },
        alerts: {
            reload: {
                title: 'Reload Model',
                content: 'Are you sure you want to reload the model? All unsaved changes will be lost.',
            },
        },
        error: {
            'path-duplicate': 'This path is already used by another page.',
        },
        noneSelected: 'No model selected',
    },
} satisfies Namespace;
