import { type Namespace } from '@digital-net/react-app';

export default {
    namespace: 'router',
    fr: {
        page: {
            title: {
                ['*']: 'Page non trouvée',
                [ROUTER_HOME]: 'Accueil',
                [ROUTER_LOGIN]: 'Connexion',
                [ROUTER_EDITOR]: 'Editer mes pages',
            },
        },
    },
    en: {
        page: {
            title: {
                ['*']: 'Page not found',
                [ROUTER_HOME]: 'Home',
                [ROUTER_LOGIN]: 'Login',
                [ROUTER_EDITOR]: 'Edit my pages',
            },
        },
    },
} satisfies Namespace;
