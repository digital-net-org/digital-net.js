import * as React from 'react';
import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import type { ArticleDto } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext } from '../../../entity';
import { DnInputCode } from '../../../ui';

type EditorMode = 'wysiwyg' | 'html';

export function ArticleTabContent() {
    const { values, setField, disabled } = useDnEntityFormContext<ArticleDto>();
    const [mode, setMode] = React.useState<EditorMode>('wysiwyg');

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, next: EditorMode | null) => {
        if (next) setMode(next);
    };

    const handleContentChange = (value: string) => setField('/content', value);

    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleModeChange}
                size="small"
                aria-label="Mode d'édition"
            >
                <ToggleButton value="wysiwyg">WYSIWYG</ToggleButton>
                <ToggleButton value="html">HTML</ToggleButton>
            </ToggleButtonGroup>

            <Stack sx={{ flex: 1, minHeight: 0 }}>
                {mode === 'html' ? (
                    <DnInputCode
                        language="html"
                        value={values.content ?? ''}
                        onChange={handleContentChange}
                        disabled={disabled}
                    />
                ) : (
                    <Box
                        sx={{
                            p: 4,
                            border: '1px dashed',
                            borderColor: 'divider',
                            borderRadius: 1,
                            textAlign: 'center',
                        }}
                    >
                        <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Éditeur Lexical à venir (US-ART-06).
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Stack>
    );
}
