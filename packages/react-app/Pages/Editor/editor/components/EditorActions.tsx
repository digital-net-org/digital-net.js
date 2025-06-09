import React from 'react';
import { Actions } from './Actions';
import { useEditorContext } from '../../state';

export function EditorActions() {
    const { isModified, isLoading, handlePatch, handleDelete } = useEditorContext();
    return (
        <Actions
            actions={[
                {
                    onClick: handlePatch,
                    icon: 'FloppyIcon',
                    disabled: isLoading || !isModified,
                },
                {
                    onClick: handleDelete,
                    icon: 'TrashIcon',
                    disabled: isLoading || isModified,
                },
            ]}
        />
    );
}
