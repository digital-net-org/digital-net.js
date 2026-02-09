import type { DOMAttributes, RefAttributes } from 'react';
import type { EssentialReactProps } from './EssentialReactProps';
import type { ReactEvents } from './ReactEvents';

export type DnReactElement<T extends HTMLElement, E extends keyof DOMAttributes<T> = never> = EssentialReactProps &
    RefAttributes<T> &
    ReactEvents<T, E> &
    Partial<Omit<T, keyof HTMLElement>>;
