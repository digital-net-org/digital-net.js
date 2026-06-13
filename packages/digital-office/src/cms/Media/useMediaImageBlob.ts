import { useQuery, useQueryClient } from '@tanstack/react-query';
import { buildKeyFromId, useDigitalNetApi } from '../../api';

export interface UseMediaImageBlobOptions {
    width?: number;
    quality?: number;
    extension?: string;
    enabled?: boolean;
}

/**
 * Caches the authenticated image blob in React Query, keyed by (mediaId, width, quality, extension).
 *
 * Why cache the Blob and not the object URL: React Query has no destructor on cache eviction, so a
 * cached `URL.createObjectURL` string could never be revoked safely. We cache the Blob (shared across
 * consumers) and let each component derive + revoke its own object URL on unmount.
 *
 * Why not `<img src>`: the image endpoint authenticates by request header only (Bearer / ApiKey /
 * Application key) — a plain <img> tag cannot carry it, so the authenticated fetch is mandatory here.
 *
 * `gcTime` is kept short (5 min, vs the 15 min default) to bound memory: a cached blob retains its
 * bytes until eviction, and the preview dialog loads the full-resolution original.
 */
export function useMediaImageBlob(mediaId: string, options: UseMediaImageBlobOptions = {}) {
    const api = useDigitalNetApi();
    const queryClient = useQueryClient();
    const { width, quality, extension, enabled } = options;

    return useQuery({
        queryKey: ['media', 'image', mediaId, width ?? null, quality ?? null, extension ?? 'webp'],
        queryFn: async () => {
            const result = await api.catalog.media.getImageBlob(mediaId, { width, quality, extension });
            if (result.hasError || !result.value) {
                throw new Error(result.errors[0]?.message ?? 'Media image fetch failed');
            }
            void queryClient.invalidateQueries({ queryKey: buildKeyFromId('media', mediaId) });
            return result.value;
        },
        // Image bytes are immutable for a given key; freshness is handled by SSE `media` invalidation.
        staleTime: Infinity,
        gcTime: 5 * 60 * 1000,
        enabled,
    });
}
