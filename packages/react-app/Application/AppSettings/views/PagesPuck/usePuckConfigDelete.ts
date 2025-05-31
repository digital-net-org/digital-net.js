import { digitalEndpoints } from '@digital-net/core';
import { DigitalReactClient, useDelete } from '@digital-net/react-digital-client';
import type { PuckConfigApiCallbacks } from './PuckConfigApiCallbacks';

export function usePuckConfigDelete({ onError, onSuccess }: PuckConfigApiCallbacks) {
    const { delete: deleteConfig, isDeleting } = useDelete(digitalEndpoints['page/config'], {
        onSuccess: () => {
            DigitalReactClient.invalidate(digitalEndpoints['page/config/upload'], digitalEndpoints['page/config/test']);
            onSuccess?.();
        },
        onError,
    });

    return { deleteConfig, isDeleting };
}
