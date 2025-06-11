import React from 'react';
import type { Config } from '@measured/puck';
import { useDigitalImport } from '@digital-net/react-digital-client';
import { useToaster } from '../../../Toaster';

export function usePuckConfig(version: string | undefined) {
    const { toast } = useToaster();
    const [puckConfig, setPuckConfig] = React.useState<Config | undefined>(undefined);

    const { isLoading: isImporting } = useDigitalImport<(r: typeof React) => Config>('page/config/version/:version', {
        slugs: { version },
        onError: () =>
            toast(
                {
                    key: 'app:alerts.errors.puckConfigValidation.invalid',
                    interpolation: { version },
                },
                'error'
            ),
        onSuccess: (result: (r: typeof React) => Config) => {
            const config = result(React);
            setPuckConfig(config);
        },
        enabled: Boolean(version),
    });

    return {
        puckConfig,
        isImporting,
    };
}
