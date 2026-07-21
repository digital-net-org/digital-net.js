import * as React from 'react';
import { Stack } from '@mui/material';
import {
    FormatAlignCenter as AlignCenterIcon,
    FormatAlignJustify as AlignJustifyIcon,
    FormatAlignLeft as AlignLeftIcon,
    FormatAlignRight as AlignRightIcon,
    FormatBold as BoldIcon,
    FormatItalic as ItalicIcon,
    FormatListBulleted as UlIcon,
    FormatListNumbered as OlIcon,
    FormatQuote as QuoteIcon,
    FormatUnderlined as UnderlineIcon,
    Redo as RedoIcon,
    StrikethroughS as StrikeIcon,
    Title as TitleIcon,
    Undo as UndoIcon,
} from '@mui/icons-material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createCommand } from 'lexical';
import { DnIconButton } from '../../DnIconButton';
import { LEXICAL_HEADING_LEVELS } from './lexicalConfig';
import { useLexicalFormatters } from './useLexicalFormatters';
import { useLexicalHistory } from './useLexicalHistory';
import { LexicalToolbarDivider } from './LexicalToolbarDivider';

// Placeholder pour future extension (insertion image, lien, etc.) si on veut un command dédié.
export const INSERT_IMAGE_COMMAND = createCommand<string>('INSERT_IMAGE_COMMAND');

interface LexicalToolbarProps {
    disabled?: boolean;
}

export function LexicalToolbar({ disabled = false }: LexicalToolbarProps) {
    const [editor] = useLexicalComposerContext();
    const { canUndo, canRedo, undo, redo } = useLexicalHistory(editor);
    const {
        formatHeading,
        formatQuote,
        toBold,
        toItalic,
        toUnderline,
        toStrikethrough,
        toOrderedList,
        toUnorderedList,
        toAlignLeft,
        toAlignCenter,
        toAlignRight,
        toAlignJustify,
    } = useLexicalFormatters(editor);

    return (
        <Stack
            direction="row"
            spacing={0.25}
            sx={theme => ({
                flexWrap: 'wrap',
                gap: 0.25,
                p: 0.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                fontSize: theme.typography.fontSize * 0.75,
            })}
        >
            {[
                { label: 'Annuler', icon: <UndoIcon />, disabled: disabled || !canUndo, onClick: undo },
                { label: 'Rétablir', icon: <RedoIcon />, disabled: disabled || !canRedo, onClick: redo },
            ].map(({ icon, label, ...rest }) => (
                <DnIconButton key={label} tooltip={label} {...rest}>
                    {icon}
                </DnIconButton>
            ))}
            <LexicalToolbarDivider />
            {[
                { label: 'Gras', icon: <BoldIcon />, onClick: toBold },
                { label: 'Italique', icon: <ItalicIcon />, onClick: toItalic },
                { label: 'Souligné', icon: <UnderlineIcon />, onClick: toUnderline },
                { label: 'Barré', icon: <StrikeIcon />, onClick: toStrikethrough },
            ].map(({ icon, label, ...rest }) => (
                <DnIconButton key={label} tooltip={label} disabled={disabled} {...rest}>
                    {icon}
                </DnIconButton>
            ))}
            <LexicalToolbarDivider />
            {LEXICAL_HEADING_LEVELS.map(tag => (
                <DnIconButton
                    key={tag}
                    tooltip={tag.toUpperCase()}
                    disabled={disabled}
                    onClick={() => formatHeading(tag)}
                    sx={{ position: 'relative' }}
                >
                    <TitleIcon fontSize="small" />
                    <span style={{ position: 'absolute', bottom: 2, right: 2, fontSize: 9, fontWeight: 700 }}>
                        {tag.slice(1)}
                    </span>
                </DnIconButton>
            ))}
            <LexicalToolbarDivider />
            {[
                { label: 'Liste à puces', icon: <UlIcon />, onClick: toUnorderedList },
                { label: 'Liste ordonnée', icon: <OlIcon />, onClick: toOrderedList },
                { label: 'Citation', icon: <QuoteIcon />, onClick: formatQuote },
            ].map(({ icon, label, ...rest }) => (
                <DnIconButton key={label} tooltip={label} disabled={disabled} {...rest}>
                    {icon}
                </DnIconButton>
            ))}
            <LexicalToolbarDivider />
            {[
                { label: 'Aligner à gauche', icon: <AlignLeftIcon />, onClick: toAlignLeft },
                { label: 'Centrer', icon: <AlignCenterIcon />, onClick: toAlignCenter },
                { label: 'Aligner à droite', icon: <AlignRightIcon />, onClick: toAlignRight },
                { label: 'Justifier', icon: <AlignJustifyIcon />, onClick: toAlignJustify },
            ].map(({ icon, label, ...rest }) => (
                <DnIconButton key={label} tooltip={label} disabled={disabled} {...rest}>
                    {icon}
                </DnIconButton>
            ))}
        </Stack>
    );
}
