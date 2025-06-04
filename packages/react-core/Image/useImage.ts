import React from 'react';

export function useImage(src: string | undefined) {
    const [hasError, setHasError] = React.useState(false);

    const htmlImage = React.useMemo(() => {
        if (!src) return;
        const img = new Image();
        img.src = src;
        return img;
    }, [src]);

    React.useEffect(() => {
        if (!htmlImage || src?.length === 0) return setHasError(true);

        htmlImage.addEventListener('error', () => {
            console.error(`useImage: Image could not be loaded: ${src}`);
            setHasError(true);
        });

        htmlImage.addEventListener('load', () => setHasError(false));

        return () => {
            htmlImage.removeEventListener('error', () => setHasError(true));
            htmlImage.removeEventListener('load', () => setHasError(false));
        };
    }, [htmlImage, src]);

    return { htmlImage, hasError };
}
