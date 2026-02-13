import type { DOMAttributes } from 'react';

export type ReactEvents<T, K extends keyof DOMAttributes<T>> = Pick<DOMAttributes<T>, K>;
