import * as React from 'react';
import { Stack } from '@mui/material';
import { DnInput } from '../../DnInput';
import { DnDialog } from '../../DnDialog';

export interface LexicalLinkValue {
    url: string;
    text: string;
}

export interface LexicalLinkDialogProps {
    open: boolean;
    initial: LexicalLinkValue | null;
    onClose: () => void;
    onSubmit: (_value: LexicalLinkValue) => void;
}

export function LexicalLinkDialog({ open, initial, onClose, onSubmit }: LexicalLinkDialogProps) {
    const [url, setUrl] = React.useState('');
    const [text, setText] = React.useState('');
    const [prevOpen, setPrevOpen] = React.useState(open);

    if (prevOpen !== open) {
        setPrevOpen(open);
        if (open) {
            setUrl(initial?.url ?? '');
            setText(initial?.text ?? '');
        }
    }

    const handleConfirm = () => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) return;
        onSubmit({ url: trimmedUrl, text: text.trim() });
    };

    return (
        <DnDialog
            open={open}
            title={initial ? 'Modifier le lien' : 'Insérer un lien'}
            onClose={onClose}
            onConfirm={handleConfirm}
            disabled={!url.trim()}
        >
            <Stack sx={{ mt: 1, gap: 2 }}>
                <DnInput label="URL" value={url} onChange={e => setUrl(e.target.value)} autoFocus required fullWidth />
                <DnInput
                    label="Texte du lien"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    helperText="Laisser vide pour afficher l'URL."
                    fullWidth
                />
            </Stack>
        </DnDialog>
    );
}
