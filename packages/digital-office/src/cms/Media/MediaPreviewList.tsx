import * as React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDnApi } from '../../api';

export interface MediaPreviewImageProps {
    mediaId: string;
    extension?: string;
    alt?: string;
}

const DEFAULT_PREVIEW_SIZE = 54;

export function MediaPreviewList({ mediaId, extension, alt = '' }: MediaPreviewImageProps) {
    const api = useDnApi();
    const [blobUrl, setBlobUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        let currentUrl: string | null = null;

        (async () => {
            const result = await api.catalog.media.getImageBlob(mediaId, {
                width: DEFAULT_PREVIEW_SIZE * 2,
                quality: 100,
                extension,
            });
            if (cancelled || result.hasError || !result.value) return;
            currentUrl = URL.createObjectURL(result.value);
            setBlobUrl(currentUrl);
        })();

        return () => {
            cancelled = true;
            if (currentUrl) URL.revokeObjectURL(currentUrl);
        };
    }, [api, mediaId, extension]);

    if (!blobUrl) return <Placeholder />;

    return <Image src={blobUrl} alt={alt} loading="lazy" decoding="async" />;
}

const Image = styled('img')(() => ({
    marginTop: '.25rem',
    marginBottom: '.25rem',
    display: 'block',
    width: DEFAULT_PREVIEW_SIZE,
    height: DEFAULT_PREVIEW_SIZE,
    objectFit: 'cover',
    borderRadius: 4,
}));

const Placeholder = styled(Box)(({ theme }) => ({
    width: DEFAULT_PREVIEW_SIZE,
    height: DEFAULT_PREVIEW_SIZE,
    borderRadius: 4,
    backgroundColor: theme.palette.action.hover,
}));
