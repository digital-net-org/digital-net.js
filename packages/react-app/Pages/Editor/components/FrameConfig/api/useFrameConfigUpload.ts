import React from 'react';
import { useDigitalMutation } from '@digital-net/react-digital-client';
import type { Result } from '@digital-net/core';
import { FrameConfigApi } from './FrameConfigApi';
import type { FrameConfigCallbacks } from './types';
import type { PagePuckConfigPayload, PagePuckConfig } from '@digital-net/core';

export function useFrameConfigUpload({ onError, onSuccess }: FrameConfigCallbacks) {
    const { mutate: create, isPending } = useDigitalMutation<Result<PagePuckConfig>>(`${FrameConfigApi.api}/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onError,
        onSuccess: () => {
            FrameConfigApi.InvalidateApi();
            onSuccess?.();
        },
    });

    const upload = React.useCallback(
        (payload: Partial<PagePuckConfigPayload>) => {
            if (!payload.version || !payload.file) {
                console.error('FrameConfig: Upload: Form state is undefined');
                return;
            }

            const form = new FormData();
            for (const [key, value] of Object.entries(payload)) {
                form.append(key, value);
            }
            create({ body: form });
        },
        [create]
    );

    return { upload, isPending };
}
