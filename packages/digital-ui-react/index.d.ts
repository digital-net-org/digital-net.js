import type { DetailedHTMLProps, HTMLAttributes, ReactHTMLElement } from 'react';
import type { DnInputSwitch } from '@digital-net-org/digital-ui';

type WebComponentProps<T extends HTMLElement> = DetailedHTMLProps<HTMLAttributes<T>, T> &
    Partial<Omit<T, keyof ReactHTMLElement<any>>>;

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'dn-input-switch': WebComponentProps<DnInputSwitch>;
        }
    }
}

export {};
