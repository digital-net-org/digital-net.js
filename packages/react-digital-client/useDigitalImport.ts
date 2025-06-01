import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { type DigitalEndpoint, ObjectMatcher, URI } from '@digital-net/core';
import { type DigitalImportConfig, DigitalReactClient } from './DigitalReactClient';

export function useDigitalImport<T>(
    endpoint: DigitalEndpoint,
    { enabled, ...config }: DigitalImportConfig & { enabled?: boolean } = { enabled: true }
) {
    const queryKey = React.useMemo(() => URI.applyParams(endpoint, config.params), [config.params, endpoint]);

    const { data: content, ...response } = useQuery<T>({
        queryKey: [queryKey],
        queryFn: async () => DigitalReactClient.import<T>(endpoint, { ...config }),
        enabled: enabled,
    });

    const data = React.useMemo(() => (ObjectMatcher.isEmptyObject(content) ? undefined : content), [content]);

    return { data, ...response };
}
