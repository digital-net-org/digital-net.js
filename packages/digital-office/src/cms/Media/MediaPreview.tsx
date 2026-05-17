import * as React from 'react';
import { Box } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useDnApi } from '../../api';
import { DN_QUERY_KEY_GET } from '../../entity';
import { MediaPreviewDialog } from './MediaPreviewDialog';

export type MediaPreviewVariant = 'default' | 'list';

export interface MediaPreviewProps {
    mediaId: string;
    extension?: string;
    alt?: string;
    variant?: MediaPreviewVariant;
}

interface VariantConfig {
    size: number;
    quality: number;
    borderRadius: number;
    marginY: string | number;
}

const VARIANT_CONFIG: Record<MediaPreviewVariant, VariantConfig> = {
    default: { size: 240, quality: 100, borderRadius: 8, marginY: 0 },
    list: { size: 54, quality: 100, borderRadius: 4, marginY: '.25rem' },
};

export function MediaPreview({ mediaId, extension, alt = '', variant = 'default' }: MediaPreviewProps) {
    const config = VARIANT_CONFIG[variant];
    const api = useDnApi();
    const queryClient = useQueryClient();
    const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const isClickable = variant === 'default';

    React.useEffect(() => {
        let cancelled = false;
        let currentUrl: string | null = null;

        (async () => {
            const result = await api.catalog.media.getImageBlob(mediaId, {
                width: config.size * 2,
                quality: config.quality,
                extension,
            });
            if (cancelled || result.hasError || !result.value) return;
            currentUrl = URL.createObjectURL(result.value);
            setBlobUrl(currentUrl);
            // The fetch may have triggered backend lazy variant generation; refresh the cached
            // MediaDto so `values.variants` reflects the new entry in MediaTabVariants.
            await queryClient.invalidateQueries({ queryKey: [DN_QUERY_KEY_GET, 'media', mediaId] });
        })();

        return () => {
            cancelled = true;
            if (currentUrl) URL.revokeObjectURL(currentUrl);
        };
    }, [api, queryClient, mediaId, extension, config.size, config.quality]);

    if (!blobUrl) {
        return (
            <Box
                sx={{
                    width: config.size * (16 / 9),
                    height: config.size,
                    borderRadius: `${config.borderRadius}px`,
                    bgcolor: 'action.hover',
                    my: config.marginY,
                }}
            />
        );
    }

    return (
        <React.Fragment>
            <Box
                component="img"
                src={blobUrl}
                alt={alt}
                loading="lazy"
                decoding="async"
                onClick={isClickable ? () => setDialogOpen(true) : undefined}
                sx={{
                    display: 'block',
                    height: config.size,
                    objectFit: 'cover',
                    borderRadius: `${config.borderRadius}px`,
                    my: config.marginY,
                    mx: 'auto',
                    cursor: isClickable ? 'pointer' : undefined,
                }}
            />
            {isClickable ? (
                <MediaPreviewDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    mediaId={mediaId}
                    alt={alt}
                />
            ) : null}
        </React.Fragment>
    );
}
