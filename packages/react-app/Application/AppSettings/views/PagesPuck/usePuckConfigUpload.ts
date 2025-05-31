import React from 'react';
import { DigitalReactClient, useDigitalMutation } from '@digital-net/react-digital-client';
import { type Result, type PagePuckConfigPayload, type PagePuckConfig, digitalEndpoints } from '@digital-net/core';
import { type PuckConfigApiCallbacks } from './PuckConfigApiCallbacks';

export function usePuckConfigUpload({ onError, onSuccess }: PuckConfigApiCallbacks) {
    const { mutate: create, isPending } = useDigitalMutation<Result<PagePuckConfig>>(
        digitalEndpoints['page/config/upload'],
        {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onError,
            onSuccess: () => {
                DigitalReactClient.invalidate(
                    digitalEndpoints['page/config/upload'],
                    digitalEndpoints['page/config/test']
                );
                onSuccess?.();
            },
        }
    );

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
