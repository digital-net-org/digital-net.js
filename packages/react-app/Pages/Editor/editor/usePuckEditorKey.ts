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
        const unsubscribeRemoveEvent = IDbStore.subscribeEvent('onRemove', payload =>
            payload?.store === EditorApiHelper.store && payload.id === id
                ? setValue(`${id}-${Date.now().toString()}`)
                : void 0
        );
        return () => {
            unsubscribeRemoveEvent();
        };
    }, [id]);

    return value;
}
