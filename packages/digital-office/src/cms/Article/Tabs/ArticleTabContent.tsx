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
