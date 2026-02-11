import type { DnAvatar, DnIcon, DnInputSwitch } from '@digital-net-org/digital-ui';
import type { DnReactElement } from './DnReactElement';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'dn-input-switch': DnReactElement<DnInputSwitch, 'onChange' | 'onClick'>;
            'dn-icon': DnReactElement<DnIcon, 'onClick'>;
            'dn-avatar': DnReactElement<DnAvatar, 'onClick'>;
        }
    }
}

export {};
