import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ObjectMatcher } from '@digital-lib/core';
import { ResultBuilder } from '@digital-lib/dto';
import { DigitalClient } from '../core/digital-api/DigitalClient';
import { type QueryOptions, type RequestCallbacks } from './types';

export function useDigitalImport<T>(key: string, { trigger, onError, onSuccess }: RequestCallbacks<T> & QueryOptions) {
    const { data: content, ...response } = useQuery<T>({
        queryKey: trigger !== false ? [key] : [],
        queryFn: async () => {
            let result = {} as T;
            if (trigger === false) {
                return result;
            }
            const { data, status } = await DigitalClient.get(key, {
                headers: {
                    'Content-Type': 'application/javascript',
                },
            });

            if (status >= 400 || !data || typeof data !== 'string') {
                await onError?.({ ...ResultBuilder.buildError(data), status });
            } else {
                try {
                    const blob = new Blob([data], { type: 'application/javascript' });
                    const url = URL.createObjectURL(blob);
                    result = (await import(url)).default as T;
                    URL.revokeObjectURL(url);
                    await onSuccess?.(result);
                } catch (e) {
                    console.error('useImport: Could not load Javascript file, only ESM is supported.', e);
                    await onError?.({ ...ResultBuilder.buildError(data), status });
                }
            }
            return result;
        },
    });

    const data = React.useMemo(() => (ObjectMatcher.isEmptyObject(content) ? undefined : content), [content]);

    return { data, ...response };
}
