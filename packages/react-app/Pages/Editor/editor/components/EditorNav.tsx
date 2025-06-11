import React from 'react';
import { Box, IconButton, Text } from '@digital-net/react-digital-ui';
import { useOnClickOutside } from '@digital-net/react-core';
import { Localization } from '../../../../Localization';
import { useEditorContext } from '../../state';
import { EditorHelper } from '../EditorHelper';
import { EditorNavItem } from './EditorNavItem';

export function EditorNav() {
    const { pageList, isLoading, reload, handleCreate, togglePanel, isPanelOpen } = useEditorContext();
    const panelRef = React.useRef<HTMLDivElement>(null);
    useOnClickOutside(panelRef, () => isPanelOpen && togglePanel());

    return (
        <div
            ref={panelRef}
            className={`${EditorHelper.className}-Panel`}
            data-panel-type={isPanelOpen ? 'open' : 'closed'}
        >
            <div className={`${EditorHelper.className}-Nav`}>
                <div className={`${EditorHelper.className}-Nav-Title`}>
                    <Text variant="caption">{Localization.translate('page-editor:navigation.title')}</Text>
                    <Box direction="row" gap={1}>
                        <IconButton icon="ReloadIcon" onClick={() => reload('all')} />
                        <IconButton icon="AddIcon" onClick={handleCreate} />
                        <IconButton icon="CloseIcon" variant="icon-bordered" onClick={togglePanel} critical />
                    </Box>
                </div>
                <div className={`${EditorHelper.className}-Nav-List`}>
                    {(pageList ?? []).map(e => (
                        <React.Fragment key={e.id}>
                            <EditorNavItem page={e} isLoading={isLoading} />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
