import React from 'react';
import type { Config } from '@measured/puck';
import { useGet, useDigitalImport } from '@digital-net/react-digital-client';
import { useToaster, useApplicationUser } from '@digital-net/react-app';
import { EntityHelper, type PagePuckConfig } from '@digital-net/core';
import { useFrameConfigValidator } from './api/useFrameConfigValidator';
import { digitalEndpoints } from '@digital-net/core';

export interface FrameConfigState {
    isConfigUploaded?: boolean;
    configs: Array<PagePuckConfig>;
    loadedConfig?: Config;
    loadConfig: (version: Version) => void;
    isLoading: boolean;
    isValidating: boolean;
}

export const FrameConfigContext = React.createContext<FrameConfigState>({
    isConfigUploaded: undefined,
    configs: [],
    isLoading: false,
    isValidating: true,
    loadConfig: () => void 0,
});

type Version = PagePuckConfig['version'];

export function FrameConfigProvider({ children }: React.PropsWithChildren<{}>) {
    const { isLogged } = useApplicationUser();
    const { toast } = useToaster();
    const { isConfigUploaded, isValidating } = useFrameConfigValidator();

    const [loadedConfig, setLoadedConfig] = React.useState<Config>();
    const [version, setVersion] = React.useState<Version>();
    const { entities: configs, isQuerying } = useGet<PagePuckConfig>(digitalEndpoints['page/config'], {
        onSuccess: result => {
            const defaultVersion = EntityHelper.getLatest(result.value ?? []);
            if (defaultVersion) {
                setVersion(defaultVersion.version);
            }
        },
        trigger: isLogged,
    });
    const { isLoading: isImporting } = useDigitalImport<(r: typeof React) => Config>(
        `${digitalEndpoints['page/config/version']}/${version}`,
        {
            trigger: Boolean(version),
            onError: () =>
                toast(
                    {
                        key: 'pages-app:errors.noFrameValidation.invalid',
                        interpolation: { version },
                    },
                    'error'
                ),
            onSuccess: (result: (r: typeof React) => Config) => {
                const config = result(React);
                setLoadedConfig(config);
            },
        }
    );

    React.useEffect(() => console.log(version, loadedConfig), [version, loadedConfig]);

    const isLoading = React.useMemo(() => isQuerying || isImporting, [isQuerying, isImporting]);

    return (
        <FrameConfigContext.Provider
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
        </FrameConfigContext.Provider>
    );
}
