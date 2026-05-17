import * as React from 'react';
import { Box, CircularProgress, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useQueryClient } from '@tanstack/react-query';
import { useDnApi } from '../../api';
import { DN_QUERY_KEY_GET } from '../../entity';

export interface MediaPreviewDialogProps {
    open: boolean;
    onClose: () => void;
    mediaId: string;
    alt?: string;
}

export function MediaPreviewDialog({ open, onClose, mediaId, alt = '' }: MediaPreviewDialogProps) {
    const api = useDnApi();
    const queryClient = useQueryClient();
    const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
    const [isZoomed, setIsZoomed] = React.useState(false);

    React.useEffect(() => {
        if (!open) return;
        let cancelled = false;
        let currentUrl: string | null = null;

        (async () => {
            const result = await api.catalog.media.getImageBlob(mediaId);
            if (cancelled || result.hasError || !result.value) return;
            currentUrl = URL.createObjectURL(result.value);
            setBlobUrl(currentUrl);
            await queryClient.invalidateQueries({ queryKey: [DN_QUERY_KEY_GET, 'media', mediaId] });
        })();

        return () => {
            cancelled = true;
            if (currentUrl) URL.revokeObjectURL(currentUrl);
            setBlobUrl(null);
            setIsZoomed(false);
        };
    }, [open, api, queryClient, mediaId]);

    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <CloseButton onClick={onClose} aria-label="Fermer" sx={{ marginRight: 2 }}>
                <CloseIcon />
            </CloseButton>
            <DialogContent
                sx={{
                    p: 0,
                    overflow: 'auto',
                    display: 'flex',
                    alignItems: isZoomed ? 'flex-start' : 'center',
                    justifyContent: isZoomed ? 'flex-start' : 'center',
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                {blobUrl ? (
                    <Box
                        component="img"
                        src={blobUrl}
                        alt={alt}
                        onClick={() => setIsZoomed(z => !z)}
                        sx={{
                            display: 'block',
                            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                            ...(isZoomed
                                ? { width: 'auto', height: 'auto', maxWidth: 'none', maxHeight: 'none' }
                                : { maxWidth: '100%', maxHeight: '100vh' }),
                        }}
                    />
                ) : (
                    <CircularProgress />
                )}
            </DialogContent>
        </Dialog>
    );
}

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    '&:hover': { backgroundColor: theme.palette.action.hover },
}));
