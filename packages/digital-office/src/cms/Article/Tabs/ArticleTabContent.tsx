import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import type { ArticleDto } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext } from '../../../entity';
import { DnInputCode } from '../../../ui';
import { LexicalRichEditor } from '../LexicalEditor';
import { useEditorScrollMemory } from './useEditorScrollMemory';

type EditorMode = 'wysiwyg' | 'html';

export function ArticleTabContent() {
    const { values, setField, disabled } = useDnEntityFormContext<ArticleDto>();
    const [mode, setMode] = React.useState<EditorMode>('wysiwyg');
    const scrollMemory = useEditorScrollMemory(mode);

    const handleModeChange = (_: React.MouseEvent<HTMLElement>, next: EditorMode | null) =>
        next ? setMode(next) : void 0;
    const handleContentChange = (value: string) => setField('/content', value);

    return (
        <Stack sx={{ height: '100%' }}>
            <Toolbar>
                <ToggleGroup
                    value={mode}
                    onChange={handleModeChange}
                    exclusive
                    size="small"
                    aria-label="Mode d'édition"
                >
                    <ToggleButton value="wysiwyg">Texte enrichi</ToggleButton>
                    <ToggleButton value="html">HTML</ToggleButton>
                </ToggleGroup>
            </Toolbar>

            <Stack sx={{ flex: 1, minHeight: 0 }}>
                {mode === 'html' ? (
                    <DnInputCode
                        language="html"
                        value={values.content ?? ''}
                        onChange={handleContentChange}
                        disabled={disabled}
                        {...scrollMemory}
                    />
                ) : (
                    <LexicalRichEditor
                        value={values.content ?? ''}
                        onChange={handleContentChange}
                        disabled={disabled}
                        {...scrollMemory}
                    />
                )}
            </Stack>
        </Stack>
    );
}

const ToggleGroup = styled(ToggleButtonGroup)(
    ({ theme }) => css`
        padding: 0;
        transform-origin: top right;

        & .MuiButtonBase-root {
            font-size: xx-small;
            padding: ${theme.spacing(0.5)} ${theme.spacing(0.75)} ${theme.spacing(0.25)};
        }
    `
);

const Toolbar = styled(Stack)(
    ({ theme }) => css`
        padding: ${theme.spacing(1)} 0;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        gap: ${theme.spacing(1)};
    `
);
