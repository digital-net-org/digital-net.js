import React from 'react';
import type { PageMeta, StoredPatchOperation } from '@digital-net/core';
import { Box, IconButton } from '@digital-net/react-digital-ui';
import { useEditorContext, usePageMetaStore } from '../state';
import { MetaField } from './MetaField';
import { IDbStore } from '@digital-net/react-app/Storage';

export function PuckPanelFieldsMetas() {
    const { page, pageMetas } = useEditorContext();
    const { getPageMetas, clearStore, remove, add, update } = usePageMetaStore(pageMetas);
    const [storedMetas, setStoredMetas] = React.useState<Array<StoredPatchOperation<PageMeta>>>();

    React.useEffect(() => {
        const refreshMetas = async () => setStoredMetas(page?.id ? await getPageMetas(page.id) : []);
        refreshMetas();
        const unsubscribeMetaChangeEvent = IDbStore.subscribeEvent('onCreate', payload =>
            payload?.store === 'patch:pages-metas' ? refreshMetas() : void 0
        );
        const unsubscribeMetaRemoveEvent = IDbStore.subscribeEvent('onRemove', payload =>
            payload?.store === 'patch:pages-metas' ? refreshMetas() : void 0
        );
        return () => {
            unsubscribeMetaChangeEvent();
            unsubscribeMetaRemoveEvent();
        };
    }, [getPageMetas, page?.id]);

    const metas: Array<PageMeta> = React.useMemo(() => {
        return [
            ...pageMetas.reduce<Array<PageMeta>>((acc, meta) => {
                const existing = storedMetas?.find(x => x.value.id === meta.id);
                if (!existing) {
                    return [...acc, meta];
                }
                if (existing.op !== 'remove') {
                    return [...acc, existing.value];
                }
                return acc;
            }, []),
            ...(storedMetas?.filter(x => x.op === 'add').map(x => x.value) ?? []),
        ];
    }, [pageMetas, storedMetas]);

    const handleAddMeta = React.useCallback(async () => {
        if (!page?.id) return;
        const payload = {
            id: crypto.randomUUID(),
            pageId: page.id,
            key: 'name',
            content: '',
            value: '',
            createdAt: new Date(Date.now()),
        };
        await add(payload);
    }, [add, page?.id]);

    const handleDeleteMeta = React.useCallback(async (meta: PageMeta) => await remove(meta), [remove]);
    const handleUpdateMeta = React.useCallback(async (meta: PageMeta) => await update(meta), [update]);
    const handleReloadMetas = React.useCallback(async () => await clearStore(page?.id), [clearStore, page?.id]);

    return (
        <Box fullWidth fullHeight overflow="hidden">
            <Box direction="row" px={2} mb={1} gap={1} align="center" fullWidth>
                <IconButton icon="AddIcon" variant="icon-bordered" onClick={handleAddMeta} disabled={!page?.id} />
                <IconButton
                    icon="ReloadIcon"
                    variant="icon-bordered"
                    onClick={handleReloadMetas}
                    disabled={!storedMetas?.length}
                />
            </Box>
            <Box gap={3} p={2} fullWidth fullHeight overflow="scroll">
                {metas.map(meta => (
                    <MetaField key={meta.id} meta={meta} onDelete={handleDeleteMeta} onUpdate={handleUpdateMeta} />
                ))}
            </Box>
        </Box>
    );
}
