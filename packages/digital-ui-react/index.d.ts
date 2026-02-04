import React from 'react';
import { DnInputSwitch } from '@digital-net/digital-ui';

// TODO: Export this in digital-ui-react package

type WebComponentProps<T extends HTMLElement> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T> &
    Partial<Omit<T, keyof React.ReactHTMLElement<any>>>;

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'input-switch': WebComponentProps<DnInputSwitch>;
        }
    }
}
