import { type Namespace } from '@digital-net/react-app';

export default {
    namespace: 'page-editor',
    fr: {
        navigation: {
            title: 'Mes modèles',
        },
        tools: {
            fields: {
                page: {
                    title: 'Configuration de la page',
                },
                metas: {
                    title: 'Configuration des métadonnées',
                },
            },
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
            'desc-max-length': 'La description dépasse la longueur maximale autorisée.',
        },
        fields: {
            path: {
                label: "Chemin d'accès (URL)",
                tooltip:
                    "Le chemin d'accès de la page, utilisé pour l'indexation et l'affichage. Il doit être unique et ne pas contenir d'espaces ou de} caractères spéciaux.",
            },
            title: {
                label: 'Titre',
                tooltip:
                    "Le titre de la page, utilisé pour l'indexation et l'affichage. Apparaît dans l'onglet de navigation du navigateur, les résultats de recherche et les aperçus.",
            },
            description: {
                label: 'Description',
                tooltip:
                    "Une brève description de la page, utilisée pour l'indexation et l'affichage. Apparaît dans les résultats de recherche et les aperçus.",
            },
            isIndexed: {
                label: 'Indexé',
                tooltip:
                    'Indique si la page doit être indexée par les moteurs de recherche. Si désactivé, la page ne sera pas indexée.',
            },
            isPublished: {
                label: 'Publié',
                tooltip:
                    'Indique si la page est publiée et visible par les utilisateurs. Si désactivé, la page sera considérée comme un brouillon et ne pourra ni être lu par un navigateur, ni indexée par les moteurs de recherche.',
            },
        },
        noneSelected: 'Aucun modèle sélectionné',
    },
    en: {
        navigation: {
            title: 'My Models',
        },
        tools: {
            fields: {
                page: {
                    title: 'Page configuration',
                },
                metas: {
                    title: 'Metadata configuration',
                },
            },
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
            'desc-max-length': 'The description exceeds the maximum length allowed.',
        },
        fields: {
            path: {
                label: 'Path',
                tooltip:
                    'The path of the page, used for indexing and display. It must be unique and should not contain spaces or special characters.',
            },
            title: {
                label: 'Title',
                tooltip:
                    'The title of the page, used for indexing and display. Appears in the browser tab, search results, and previews.',
            },
            description: {
                label: 'Description',
                tooltip:
                    'A brief description of the page, used for indexing and display. Appears in search results and previews.',
            },
            isIndexed: {
                label: 'Indexed',
                tooltip:
                    'Indicates whether the page should be indexed by search engines. If disabled, the page will not be indexed.',
            },
            isPublished: {
                label: 'Published',
                tooltip:
                    'Indicates whether the page is published and visible to users. If disabled, the page will be considered a draft and cannot be read by a browser or indexed by search engines.',
            },
        },
        noneSelected: 'No model selected',
    },
} satisfies Namespace;
