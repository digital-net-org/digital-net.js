import * as React from 'react';

export type ToastVariant = 'info' | 'error';

export interface ToastContextValue {
    showToast: (_message: string, _variant?: ToastVariant) => void;
    hide: () => void;
}

export const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useDigitalToast(): ToastContextValue {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useDigitalToast must be used within a ToastProvider.');
    }
    return context;
}
