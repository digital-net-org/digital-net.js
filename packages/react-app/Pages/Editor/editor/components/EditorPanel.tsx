import React from 'react';
import { EditorHelper } from '../EditorHelper';
import { useEditorContext } from '../../state';

export function EditorPanel({ children }: React.PropsWithChildren) {
    const { selectedTool } = useEditorContext();

    return (
        <div className={`${EditorHelper.className}-Panel`} data-panel-type={selectedTool ? 'open' : 'closed'}>
            {children}
        </div>
    );
}
