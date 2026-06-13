import * as React from 'react';
import { Box } from '@mui/material';
import { BlobImage } from './BlobImage';
import { MediaPreviewDialog } from './MediaPreviewDialog';
import { useMediaImageBlob } from './useMediaImageBlob';

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
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const isClickable = variant === 'default';

    const { data: blob } = useMediaImageBlob(mediaId, {
        width: config.size * 2,
        quality: config.quality,
        extension,
    });

    if (!blob) {
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
            <BlobImage
                blob={blob}
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
