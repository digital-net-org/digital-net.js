import React from 'react';
import { type IdbEventPayload, IDbStore } from '../../../Storage';
import { EditorApiHelper } from './EditorApiHelper';
import { usePageStore } from './usePageStore';
import { usePageMetaStore } from './usePageMetaStore';

export function useIsPageModified(id: string | undefined) {
    const [isModified, setIsModified] = React.useState(false);
    const { get } = usePageStore();
    const { getPageMetas } = usePageMetaStore([]);

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

        const onMetaEvent = (e: IdbEventPayload | undefined, setter: boolean) =>
            e?.store === 'patch:pages-metas' ? setIsModified(setter) : void 0;
        const onPageEvent = (e: IdbEventPayload | undefined, setter: boolean) =>
            e?.store === EditorApiHelper.store && e.id === id ? setIsModified(setter) : void 0;

        const unsubscribeMetaCreate = IDbStore.subscribeEvent('onCreate', payload => onMetaEvent(payload, true));
        const unsubscribeMetaUpdate = IDbStore.subscribeEvent('onUpdate', payload => onMetaEvent(payload, true));
        const unsubscribeMetaRemove = IDbStore.subscribeEvent('onRemove', payload => onMetaEvent(payload, false));
        const unsubscribePageCreate = IDbStore.subscribeEvent('onCreate', payload => onPageEvent(payload, true));
        const unsubscribePageUpdate = IDbStore.subscribeEvent('onUpdate', payload => onPageEvent(payload, true));
        const unsubscribePageRemove = IDbStore.subscribeEvent('onRemove', payload => onPageEvent(payload, false));
        return () => {
            unsubscribeMetaCreate();
            unsubscribeMetaUpdate();
            unsubscribeMetaRemove();
            unsubscribePageCreate();
            unsubscribePageUpdate();
            unsubscribePageRemove();
        };
    }, [id, get, getPageMetas]);

    return { isModified };
}
