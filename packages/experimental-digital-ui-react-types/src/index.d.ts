import type {
    DnButton,
    DnAvatar,
    DnIcon,
    DnInputSwitch,
    DnLoader,
    DnInputText,
} from '@digital-net-org/experimental-digital-ui';
import type { DnReactElement } from './DnReactElement';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'dn-button': DnReactElement<DnButton, 'onClick'>;
            'dn-icon': DnReactElement<DnIcon, 'onClick'>;
            'dn-avatar': DnReactElement<DnAvatar, 'onClick'>;
            'dn-input-switch': DnReactElement<DnInputSwitch, 'onChange' | 'onClick'>;
            'dn-input-text': DnReactElement<DnInputText, 'onChange' | 'onClick'>;
            'dn-loader': DnReactElement<DnLoader>;
        }
    }
}

export {};
