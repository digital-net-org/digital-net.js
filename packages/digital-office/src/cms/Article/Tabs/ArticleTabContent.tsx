import * as React from 'react';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { ArticleDto } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext } from '../../../entity';
import { DnInputCode } from '../../../ui';
import { LexicalRichEditor } from '../LexicalEditor';

type EditorMode = 'wysiwyg' | 'html';

export function ArticleTabContent() {
    const { values, setField, disabled } = useDnEntityFormContext<ArticleDto>();
    const [mode, setMode] = React.useState<EditorMode>('wysiwyg');

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, next: EditorMode | null) =>
        next ? setMode(next) : void 0;
    const handleContentChange = (value: string) => setField('/content', value);

    return (
        <Stack sx={{ height: '100%', position: 'relative' }}>
            <ToggleButtonGroup
                value={mode}
                onChange={handleModeChange}
                exclusive
                size="small"
                aria-label="Mode d'édition"
                sx={theme => ({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    zIndex: 1,
                    height: '2.55rem',
                    transformOrigin: 'top right',
                    background: theme.palette.background.paper,
                })}
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
                    <LexicalRichEditor
                        value={values.content ?? ''}
                        onChange={handleContentChange}
                        disabled={disabled}
                    />
                )}
            </Stack>
        </Stack>
    );
}
