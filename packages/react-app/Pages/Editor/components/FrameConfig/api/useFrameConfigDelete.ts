import { useDelete } from '@digital-net/react-digital-client';
import { FrameConfigApi } from './FrameConfigApi';
import type { FrameConfigCallbacks } from './types';

export function useFrameConfigDelete({ onError, onSuccess }: FrameConfigCallbacks) {
    const { delete: deleteConfig, isDeleting } = useDelete(FrameConfigApi.api, {
        onSuccess: () => {
            FrameConfigApi.InvalidateApi();
            onSuccess?.();
        },
        onError,
    });

    return { deleteConfig, isDeleting };
}
