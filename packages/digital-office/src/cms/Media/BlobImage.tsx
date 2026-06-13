import * as React from 'react';
import { Box, type BoxProps } from '@mui/material';

export type BlobImageProps = { blob: Blob } & Omit<BoxProps<'img'>, 'component' | 'src'>;

export function BlobImage({ blob, ...boxProps }: BlobImageProps) {
    const ref = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const url = URL.createObjectURL(blob);
        el.src = url;
        return () => URL.revokeObjectURL(url);
    }, [blob]);

    return <Box component="img" ref={ref} {...boxProps} />;
}
