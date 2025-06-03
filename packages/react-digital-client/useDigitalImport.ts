import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { type DigitalEndpoint, ObjectMatcher, URI } from '@digital-net/core';
import { type DigitalImportConfig } from './DigitalReactClient';
import { digitalClientInstance } from './digitalClientInstance';

export function useDigitalImport<T>(
    endpoint: DigitalEndpoint,
    { enabled, ...config }: DigitalImportConfig & { enabled?: boolean } = { enabled: true }
) {
    const queryKey = React.useMemo(() => URI.resolveSlugs(endpoint, config.slugs), [config.slugs, endpoint]);

    const { data: content, ...response } = useQuery<T>({
        queryKey: [queryKey],
        queryFn: async () => digitalClientInstance.import<T>(endpoint, { ...config }),
        enabled: enabled,
    });

    const data = React.useMemo(() => (ObjectMatcher.isEmptyObject(content) ? undefined : content), [content]);

    return { data, ...response };
}
