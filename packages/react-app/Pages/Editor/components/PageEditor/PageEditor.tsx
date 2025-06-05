import React from 'react';
import { type Data } from '@measured/puck';
import { type EditorProps, Editor } from '../BaseEditor';
import { PuckEditor, PuckEditorHelper } from './PuckEditor';
import { pageTools } from './Tools';
import { usePageUrlState } from './usePageUrlState';
import { usePageCrud } from './usePageCrud';
import { PageEditorHelper } from './PageEditorHelper';
import { PageNav } from './PageEditorNav';
import { usePageStore } from './usePageStore';
import './PageEditor.styles.css';

export function PageEditor() {
    const [panelState, setPanelState] = React.useState<EditorProps['panelState']>('open');
    const handlePanel = () => setPanelState(prev => (prev === 'closed' ? 'open' : 'closed'));

    const { currentTool, set } = usePageUrlState();
    const { storedEntity, storedExists, saveEntity, deleteEntity } = usePageStore();
    const { page, pageList, isLoading, handleCreate, handleDelete, handlePatch } = usePageCrud({
        stored: storedEntity,
        onDelete: async () => await deleteEntity(),
        onPatch: async () => await deleteEntity(),
    });

    const handlePuckChange = async (data: Data) => {
        if (!isLoading || !page) {
            return;
        }
        if (!PuckEditorHelper.deepEquality(data, page.data)) {
            await saveEntity({ ...page, data: JSON.stringify(data) });
        } else {
            await deleteEntity();
        }
    };

    return (
        <Editor
            className={PageEditorHelper.className}
            loading={isLoading}
            modified={page && storedExists}
            saved={page && !storedExists}
            panelState={panelState}
            setPanelState={handlePanel}
            onSave={handlePatch}
            onDelete={handleDelete}
            renderName={() => page?.path}
            renderPanel={() => (
                <PageNav
                    page={page}
                    pageList={pageList}
                    isLoading={isLoading}
                    onCreate={handleCreate}
                    onSelect={id => set('entity', id)}
                    onClose={handlePanel}
                />
            )}
            actions={pageTools.map(tool => ({
                ...tool,
                disabled: !page,
                selected: currentTool?.id === tool.id,
                onSelect: () => set('tool', tool.id),
            }))}
        >
            <PuckEditor entity={page} isLoading={isLoading} onChange={handlePuckChange} />
        </Editor>
    );
}
