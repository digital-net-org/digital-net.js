import React from 'react';
import { IDbStore } from '../../../Storage';
import { EditorApiHelper } from './EditorApiHelper';
import { usePageStore } from './usePageStore';
import { usePageMetaStore } from './usePageMetaStore';

export function useIsPageModified(id: string | undefined) {
    const [isModified, setIsModified] = React.useState(false);
    const { get } = usePageStore();
    const { getPageMetas } = usePageMetaStore(undefined, []);

    React.useEffect(() => {
        if (!id) {
            setIsModified(false);
            return;
        }
        (async () => {
            const storedPage = await get(id);
            const storedMetas = await getPageMetas(id);
            setIsModified(Boolean(storedPage) || storedMetas.length > 0);
        })();
        const unsubscribeMetaChangeEvent = IDbStore.subscribeEvent('onChange', payload =>
            payload?.store === 'patch:pages-metas' ? setIsModified(true) : void 0
        );
        const unsubscribeMetaRemoveEvent = IDbStore.subscribeEvent('onRemove', payload =>
            payload?.store === 'patch:pages-metas' ? setIsModified(false) : void 0
        );
        const unsubscribePageChangeEvent = IDbStore.subscribeEvent('onChange', payload =>
            payload?.store === EditorApiHelper.store && payload.id === id ? setIsModified(true) : void 0
        );
        const unsubscribePageRemoveEvent = IDbStore.subscribeEvent('onRemove', payload =>
            payload?.store === EditorApiHelper.store && payload.id === id ? setIsModified(false) : void 0
        );
        return () => {
            unsubscribeMetaChangeEvent();
            unsubscribeMetaRemoveEvent();
            unsubscribePageChangeEvent();
            unsubscribePageRemoveEvent();
        };
    }, [id, get, getPageMetas]);

    return { isModified };
}
