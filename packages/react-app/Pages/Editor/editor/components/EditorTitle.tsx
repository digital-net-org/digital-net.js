import React from 'react';
import { Text } from '@digital-net/react-digital-ui';
import { Localization } from '@digital-net/react-app';
import { useEditorContext } from '../../state';
import { EditorHelper } from '../EditorHelper';

export function EditorTitle() {
    const { isModified, page } = useEditorContext();

    return (
        <div className={`${EditorHelper.className}-ToolBar-Title`}>
            <Text variant="span">{page ? page.path : null}</Text>
            <Text variant="span" size="small" italic>
                {isModified ? Localization.translate('global:state.modified') : ''}
            </Text>
        </div>
    );
}
