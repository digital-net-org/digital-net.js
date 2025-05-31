import React from 'react';
import { Localization } from '@digital-net/react-app';
import { Box, IconButton, Text } from '@digital-net/react-digital-ui';
import { FrameEditorHelper } from '../FrameEditorHelper';
import { FrameNavItem } from './FrameNavItem';
import type { PageLight } from '@digital-net/core';

export interface FrameNavProps {
    frame: PageLight | undefined;
    frameList: Array<PageLight>;
    onSelect: (id: PageLight['id']) => void;
    onCreate: () => void;
    onClose: () => void;
    isLoading: boolean;
}

export function FrameNav({ frame, frameList, onSelect, onCreate, onClose, isLoading }: FrameNavProps) {
    return (
        <div className={`${FrameEditorHelper.className}-Nav`}>
            <div className={`${FrameEditorHelper.className}-Nav-Title`}>
                <Text variant="caption">{Localization.translate('frame-editor:navigation.title')}</Text>
                <Box direction="row" gap={1}>
                    <IconButton icon="ReloadIcon" onClick={() => FrameEditorHelper.invalidateGetAll()} />
                    <IconButton icon="AddIcon" onClick={onCreate} />
                    <IconButton icon="CloseIcon" variant="icon-bordered" onClick={onClose} critical />
                </Box>
            </div>
            <div className={`${FrameEditorHelper.className}-Nav-List`}>
                {(frameList ?? []).map(e => (
                    <React.Fragment key={e.id}>
                        <FrameNavItem
                            frame={e}
                            key={e.id}
                            onSelect={onSelect}
                            selected={e.id === frame?.id}
                            isLoading={isLoading}
                        />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
