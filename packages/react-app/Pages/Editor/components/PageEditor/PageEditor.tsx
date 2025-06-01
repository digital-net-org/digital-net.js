import React from 'react';
import { type Data } from '@measured/puck';
import { type EditorProps, Editor } from '../BaseEditor';
import { PuckEditor, PuckEditorHelper } from './PuckEditor';
import { pageTools } from './Tools';
import { usePageUrlState } from './usePageUrlState';
import { usePageCrud } from './usePageCrud';
import { PageEditorHelper } from './PageEditorHelper';
import { FrameNav } from './PageEditorNav';
import { usePageStore } from './usePageStore';
import './PageEditor.styles.css';

export function PageEditor() {
    const [panelState, setPanelState] = React.useState<EditorProps['panelState']>('open');
    const handlePanel = () => setPanelState(prev => (prev === 'closed' ? 'open' : 'closed'));

    const { currentTool, set } = usePageUrlState();
    const { storedEntity, storedExists, saveEntity, deleteEntity } = usePageStore();
    const {
        page: frame,
        pageList,
        isLoading,
        handleCreate,
        handleDelete,
        handlePatch,
    } = usePageCrud({
        stored: storedEntity,
        onDelete: async () => await deleteEntity(),
        onPatch: async () => await deleteEntity(),
    });

    const handlePuckChange = async (data: Data) => {
        if (!isLoading || !frame) {
            return;
        }
        if (!PuckEditorHelper.deepEquality(data, frame.data)) {
            await saveEntity({ ...frame, data: JSON.stringify(data) });
        } else {
            await deleteEntity();
        }
    };

    return (
        <Editor
            className={PageEditorHelper.className}
            loading={isLoading}
            modified={frame && storedExists}
            saved={frame && !storedExists}
            panelState={panelState}
            setPanelState={handlePanel}
            onSave={handlePatch}
            onDelete={handleDelete}
            renderName={() => frame?.path}
            renderPanel={() => (
                <FrameNav
                    page={frame}
                    pageList={pageList}
                    isLoading={isLoading}
                    onCreate={handleCreate}
                    onSelect={id => set('entity', id)}
                    onClose={handlePanel}
                />
            )}
            actions={pageTools.map(tool => ({
                ...tool,
                disabled: !frame,
                selected: currentTool?.id === tool.id,
                onSelect: () => set('tool', tool.id),
            }))}
        >
            <PuckEditor entity={frame} isLoading={isLoading} onChange={handlePuckChange} />
        </Editor>
    );
}
