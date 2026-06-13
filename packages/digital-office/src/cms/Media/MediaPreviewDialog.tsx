import * as React from 'react';
import { CircularProgress, Dialog, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { BlobImage } from './BlobImage';
import { useMediaImageBlob } from './useMediaImageBlob';

export interface MediaPreviewDialogProps {
    open: boolean;
    onClose: () => void;
    mediaId: string;
    alt?: string;
}

export function MediaPreviewDialog({ open, onClose, mediaId, alt = '' }: MediaPreviewDialogProps) {
    const [isZoomed, setIsZoomed] = React.useState(false);

    const { data: blob } = useMediaImageBlob(mediaId, { enabled: open });

    const handleClose = React.useCallback(() => {
        setIsZoomed(false);
        onClose();
    }, [onClose]);

    return (
        <Dialog open={open} onClose={handleClose} fullScreen>
            <CloseButton onClick={handleClose} aria-label="Fermer" sx={{ marginRight: 2 }}>
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
                {open && blob ? (
                    <BlobImage
                        blob={blob}
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
