import React from 'react';
import { Toast, animationDuration, type ToastProps } from '@digital-net/react-digital-ui';

interface Toast {
    type: ToastProps['variant'];
    message: string;
}

interface ToasterContextState {
    toast: (toast: Toast) => void;
}

export const ToasterContext = React.createContext<ToasterContextState>({
    toast: () => void 0,
});

const displayDuration = 3000;

export default function ToasterProvider({ children }: React.PropsWithChildren) {
    const [current, setCurrent] = React.useState<Toast>();
    const [isHidden, setIsHidden] = React.useState(true);
    const toast = (payload: Toast) => setCurrent(payload);

    React.useEffect(() => {
        if (current) {
            setIsHidden(false);
            const timeoutId = setTimeout(() => setIsHidden(true), displayDuration);
            return () => clearTimeout(timeoutId);
        }
    }, [current]);

    React.useEffect(() => {
        if (isHidden) {
            const timeoutId = setTimeout(() => setCurrent(undefined), animationDuration);
            return () => clearTimeout(timeoutId);
        }
    }, [isHidden]);

    return (
        <ToasterContext.Provider value={{ toast }}>
            <Toast variant={current?.type} hidden={isHidden} onClose={() => setIsHidden(true)}>
                {current?.message}
            </Toast>
            {children}
        </ToasterContext.Provider>
    );
}
