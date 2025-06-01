import React from 'react';
import { DigitalReactClient, useDelete, useDigitalMutation } from '@digital-net/react-digital-client';
import { type Result, type PagePuckConfigPayload, type PagePuckConfig } from '@digital-net/core';
import { useToaster } from '../../../../Toaster';

interface PuckConfigApiConfig {
    onUpload?: () => void;
    onDelete?: () => void;
}

const invalidateApi = () => DigitalReactClient.invalidate('page/config');

export function usePuckConfigApi({ onDelete, onUpload }: PuckConfigApiConfig = {}) {
    const { toast } = useToaster();
    const { mutate: create, isPending: isUploading } = useDigitalMutation<Result<PagePuckConfig>>(
        'page/config/upload',
        {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            onError: ({ status }) => toast(`app-settings:pages.pages-puck.actions.create.error.${status}`, 'error'),
            onSuccess: () => {
                toast('app-settings:pages.pages-puck.actions.create.success', 'success');
                DigitalReactClient.invalidate('page/config');
                onUpload?.();
            },
        }
    );

    const uploadConfig = React.useCallback(
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

    const { delete: deleteConfig, isDeleting } = useDelete('page/config', {
        onSuccess: () => {
            toast('app-settings:pages.pages-puck.actions.delete.success', 'success');
            DigitalReactClient.invalidate('page/config');
            DigitalReactClient.invalidateLike('page/config/version');
            onDelete?.();
        },
        onError: ({ status }) => toast(`app-settings:pages.pages-puck.actions.delete.error.${status}`, 'error'),
    });

    return { uploadConfig, isUploading, deleteConfig, isDeleting };
}
