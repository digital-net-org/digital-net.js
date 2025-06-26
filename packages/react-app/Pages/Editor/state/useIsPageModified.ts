import React from 'react';
import { IDbStore } from '../../../Storage';
import { EditorApiHelper } from './EditorApiHelper';
import { usePageStore } from './usePageStore';
import { usePageMetaStore } from '@digital-net/react-app/Pages/Editor/state/usePageMetaStore';

export function useIsPageModified(id: string | undefined) {
    const [state, setState] = React.useState(false);
    const { get } = usePageStore();
    const { state: storedMetas } = usePageMetaStore(id, []);

    const isModified = React.useMemo(() => Boolean(storedMetas.length) || state, [storedMetas.length, state]);

    React.useEffect(() => {
        if (!id) {
            setState(false);
            return;
        }
        (async () => {
            const storedPage = await get(id);
            setState(Boolean(storedPage));
        })();

        const onSet = () => setState(true);
        const onRemove = () => setState(false);

        IDbStore.onSet(EditorApiHelper.store, id, () => onSet);
        IDbStore.onRemove(EditorApiHelper.store, id, () => onRemove);
        return () => {
            IDbStore.clearListeners(EditorApiHelper.store, id, onSet);
            IDbStore.clearListeners(EditorApiHelper.store, id, onRemove);
        };
    }, [id, get]);

    return { isModified };
}
