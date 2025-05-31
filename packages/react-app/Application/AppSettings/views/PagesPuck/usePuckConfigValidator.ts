import React from 'react';
import { useToaster, useApplicationUser } from '@digital-net/react-app';
import { useDigitalQuery } from '@digital-net/react-digital-client';
import { type Result, digitalEndpoints, digitalErrorCodes } from '@digital-net/core';

export function usePuckConfigValidator() {
    const { toast } = useToaster();
    const { isLogged } = useApplicationUser();
    const [isConfigUploaded, setIsConfigUploaded] = React.useState<boolean>();

    const { isLoading: isValidating } = useDigitalQuery<Result>(digitalEndpoints['page/config/test'], {
        onSuccess: () => setIsConfigUploaded(true),
        onError: ({ errors }) => {
            if (errors.find(e => e.reference === digitalErrorCodes.NoFrameConfig) !== undefined) {
                setIsConfigUploaded(false);
                return;
            }
            toast('pages-app:errors.noFrameValidation.unhandled', 'error');
        },
        trigger: isLogged,
    });

    return { isConfigUploaded, isValidating };
}
