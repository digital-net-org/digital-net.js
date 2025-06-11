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
        config: {
            invalid:
                "La librarie {{ version }} n'est pas valide. Le fichier doit être au format ESM et renvoyer un export default.",
        },
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
        config: {
            invalid:
                'The library {{ version }} is invalid. The file must be in ESM format and return a default export.',
        },
    },
} satisfies Namespace;
