import React from 'react';
import { IDbStore } from '../../../Storage';
import { EditorApiHelper } from './EditorApiHelper';
import { usePageStore } from './usePageStore';

export function useIsPageModified(id: number | string | undefined) {
    const [isModified, setIsModified] = React.useState(false);
    const { get } = usePageStore();

    React.useEffect(() => {
        if (!id) {
            setIsModified(false);
            return;
        }
        (async () => {
            const storedPage = await get(id);
            setIsModified(Boolean(storedPage));
        })();

        IDbStore.onSet(EditorApiHelper.store, id, () => setIsModified(true));
        IDbStore.onRemove(EditorApiHelper.store, id, () => setIsModified(false));
        return () => IDbStore.clearListeners(EditorApiHelper.store, id);
    }, [id, get]);

    return { isModified };
}
