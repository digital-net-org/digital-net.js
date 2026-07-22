import * as React from 'react';
import { Box } from '@mui/material';
import type { DnEditorRichTextImageAttrs } from '../../ui';
import { useMediaImageBlob } from './useMediaImageBlob';
import { BlobImage } from './BlobImage';
import { parseMediaImageUrl } from './parseMediaImageUrl';

export type MediaContentImageProps = DnEditorRichTextImageAttrs;

// Renders a content <img> in the editor: media URLs go through the authenticated blob fetch
// (a plain <img src> cannot carry the auth header), anything else falls back to a plain image.
export function MediaContentImage({ src, alt }: MediaContentImageProps) {
    const parsed = parseMediaImageUrl(src);
    if (!parsed) return <Box component="img" src={src} alt={alt} sx={{ maxWidth: '100%' }} />;
    return <MediaBlobImage mediaId={parsed.id} extension={parsed.extension} alt={alt} />;
}

function MediaBlobImage({ mediaId, extension, alt }: { mediaId: string; extension: string; alt: string }) {
    const { data: blob } = useMediaImageBlob(mediaId, { width: 1200, extension });
    if (!blob) {
        return (
            <Box
                component="span"
                sx={{ display: 'inline-block', width: 160, height: 90, bgcolor: 'action.hover', borderRadius: 0.5 }}
            />
        );
    }
    return <BlobImage blob={blob} alt={alt} sx={{ maxWidth: '100%', display: 'block' }} />;
}
