import type { DetailedHTMLProps, HTMLAttributes, ReactHTMLElement } from 'react';

export type ReactElement<T extends HTMLElement> = DetailedHTMLProps<HTMLAttributes<T>, T> &
    Partial<Omit<T, keyof ReactHTMLElement<any>>>;
