import React from 'react';
import { useToaster, useApplicationUser } from '@digital-net/react-app';
import { useDigitalQuery } from '@digital-net/react-digital-client';
import type { Result } from '@digital-net/core';
import { digitalErrorCodes } from '@digital-net/core';
import { FrameConfigApi } from './FrameConfigApi';

export function useFrameConfigValidator() {
    const { toast } = useToaster();
    const { isLogged } = useApplicationUser();
    const [isConfigUploaded, setIsConfigUploaded] = React.useState<boolean>();

    const { isLoading: isValidating } = useDigitalQuery<Result>(FrameConfigApi.testApi, {
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
