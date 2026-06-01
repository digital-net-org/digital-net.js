import * as React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { css, styled } from '@mui/material/styles';

export interface ToastContextValue {
    showToast: (_message: string, _variant?: ToastVariant) => void;
    hide: () => void;
}

type ToastVariant = 'info' | 'error';

interface ActiveToast {
    key: number;
    message: string;
    variant: ToastVariant;
}

const DEFAULT_DURATION = 7000;
const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: React.PropsWithChildren) {
    const [toast, setToast] = React.useState<ActiveToast | null>(null);

    const hide = React.useCallback(() => setToast(null), []);

    const showToast = React.useCallback((message: string, variant?: ToastVariant) => {
        setToast({
            key: Date.now(),
            message,
            variant: variant ?? 'info',
        });
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hide }}>
            {children}
            <Snackbar
                key={toast?.key}
                open={toast !== null}
                autoHideDuration={DEFAULT_DURATION}
                onClose={hide}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                {toast ? (
                    <CustomAlert
                        onClick={hide}
                        elevation={2}
                        severity={toast.variant}
                        variant="filled"
                        sx={{ cursor: 'pointer', width: '100%' }}
                    >
                        {toast.message}
                    </CustomAlert>
                ) : undefined}
            </Snackbar>
        </ToastContext.Provider>
    );
}

const CustomAlert = styled(Alert)(
    ({ theme }) => css`
        &.MuiAlert-root {
            min-width: 300px;
        }
        &.MuiAlert-colorInfo.MuiAlert-filledInfo {
            background-color: ${theme.palette.text.primary};
            & .MuiAlert-icon {
                display: none;
            }
        }
        &.MuiAlert-colorError.MuiAlert-filledError {
            background-color: ${theme.palette.error.dark};
        }
    `
);

export function useDigitalToast(): ToastContextValue {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useDigitalToast must be used within a ToastProvider.');
    }
    return context;
}
