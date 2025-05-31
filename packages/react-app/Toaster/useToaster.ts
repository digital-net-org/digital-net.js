import React from 'react';
import { type ToastProps } from '@digital-net/react-digital-ui';
import { Localization } from '../Localization';
import { ToasterContext } from './ToasterProvider';

type ToastPayload = string | { key: string; interpolation?: Record<string, any> };

export default function useToaster() {
    const { toast } = React.useContext(ToasterContext);

    const handleToast = React.useCallback(
        (payload: ToastPayload, type?: ToastProps['variant']) => {
            toast({
                message: Localization.translate(
                    typeof payload === 'string' ? payload : payload.key,
                    typeof payload === 'string' ? undefined : payload.interpolation
                ),
                type: type,
            });
        },
        [toast]
    );

    return {
        toast: handleToast,
    };
}
