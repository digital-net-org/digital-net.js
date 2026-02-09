import type { DnInputSwitch } from '@digital-net-org/digital-ui';
import type { DnReactElement } from './DnReactElement';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'dn-input-switch': DnReactElement<DnInputSwitch, 'onChange'>;
        }
    }
}

export {};
