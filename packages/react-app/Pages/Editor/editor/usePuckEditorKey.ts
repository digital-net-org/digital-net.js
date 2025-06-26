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
        const handler = () => setValue(`${id}-${Date.now().toString()}`);
        IDbStore.onRemove(EditorApiHelper.store, id, handler);
        return () => IDbStore.clearListeners(EditorApiHelper.store, id, handler);
    }, [id]);

    return value;
}
