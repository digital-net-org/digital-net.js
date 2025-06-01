import React from 'react';
import type { Config } from '@measured/puck';
import { useGet, useDigitalImport } from '@digital-net/react-digital-client';
import { useToaster, useApplicationUser } from '@digital-net/react-app';
import { type PagePuckConfig, EntityHelper } from '@digital-net/core';
import { usePuckConfigValidator } from './views';

export interface PuckConfigState {
    isConfigUploaded?: boolean;
    configs: Array<PagePuckConfig>;
    loadedConfig?: Config;
    loadConfig: (version: Version) => void;
    isLoading: boolean;
    isValidating: boolean;
}

export const PuckConfigContext = React.createContext<PuckConfigState>({
    isConfigUploaded: undefined,
    configs: [],
    isLoading: false,
    isValidating: true,
    loadConfig: () => void 0,
});

type Version = PagePuckConfig['version'];

export function PuckConfigProvider({ children }: React.PropsWithChildren<{}>) {
    const { isLogged } = useApplicationUser();
    const { toast } = useToaster();
    const { isConfigUploaded, isValidating } = usePuckConfigValidator();

    const [loadedConfig, setLoadedConfig] = React.useState<Config>();
    const [version, setVersion] = React.useState<Version>();

    const { entities: configs, isQuerying } = useGet<PagePuckConfig>('page/config', {
        async onSuccess(result) {
            const defaultVersion = EntityHelper.getLatest(result.value ?? []);
            if (defaultVersion) {
                setVersion(defaultVersion.version);
            }
        },
        enabled: Boolean(isLogged),
    });

    const { isLoading: isImporting } = useDigitalImport<(r: typeof React) => Config>('page/config/version/:version', {
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
            setLoadedConfig(config);
        },
        enabled: Boolean(version),
    });

    const isLoading = React.useMemo(() => isQuerying || isImporting, [isQuerying, isImporting]);

    return (
        <PuckConfigContext.Provider
            value={{
                isConfigUploaded,
                loadedConfig,
                loadConfig: setVersion,
                configs: configs ?? [],
                isLoading,
                isValidating: isValidating || isConfigUploaded === undefined,
            }}
        >
            {children}
        </PuckConfigContext.Provider>
    );
}
