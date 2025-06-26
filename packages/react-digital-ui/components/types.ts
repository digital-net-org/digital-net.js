import type React from 'react';

export interface SafariNode {
    id?: string;
    className?: string;
}

export type SafariNodeWithChildren = React.PropsWithChildren & SafariNode;

export type ControlledHandler<T> = (value: T) => void | Promise<void> | React.Dispatch<React.SetStateAction<T>>;

export interface ControlledState<T> {
    onChange: ControlledHandler<T>;
    value: T;
}
