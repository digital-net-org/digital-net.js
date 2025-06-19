import React from 'react';
import { useParams } from 'react-router-dom';
import { IDbStore } from '../../../Storage';
import { EditorApiHelper } from '../state';

export function usePuckEditorKey() {
    const { id } = useParams();
    const [value, setValue] = React.useState(id);

    React.useEffect(() => {
        if (!id) {
            return;
        }
        IDbStore.onRemove(EditorApiHelper.store, id, () => setValue(`${id}-${Date.now().toString()}`));
        return () => IDbStore.clearListeners(EditorApiHelper.store, id);
    }, [id]);

    return value;
}
