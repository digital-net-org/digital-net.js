import React from 'react';
import { Actions } from './Actions';
import { useEditorContext } from '../../state';

export function EditorActions() {
    const { page, isModified, isLoading, handlePatch, handleDelete } = useEditorContext();
    return (
        <Actions
            actions={[
                {
                    onClick: handlePatch,
                    icon: 'FloppyIcon',
                    disabled: isLoading || !isModified || !page,
                },
                {
                    onClick: handleDelete,
                    icon: 'TrashIcon',
                    disabled: isLoading || isModified || !page,
                },
            ]}
        />
    );
}
