import React from 'react';
import type { PageMeta } from '@digital-net/core';
import { Box, IconButton, InputSelect, InputText } from '@digital-net/react-digital-ui';
import { useEditorContext, usePageMetaStore } from '../state';
import { baseFieldsClassName } from './PuckPanelFields';

/*
 * TODO:
 *  - Fix rendering issues when adding/removing metas
 *  - Fix rendering issues on getting metas from Rest API (no meta is shown)
 *  - Fix the delete issue when removing a meta that is not in the current state (index /-1)
 * */
export function PuckPanelFieldsMetas() {
    const { page, pageMetas } = useEditorContext();
    const { remove, add, update, state } = usePageMetaStore(page?.id, pageMetas);

    const metas: Array<PageMeta> = React.useMemo(() => {
        return [
            ...pageMetas.filter(({ id }) => state.find(x => x.id === id)),
            ...state.filter(x => x.op !== 'remove').map(x => x.value),
        ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }, [pageMetas, state]);

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

    const handleDeleteMeta = React.useCallback(
        async (id: string) => {
            if (!page?.id) return;
            const meta = metas.find(x => x.id === id);
            if (!meta) return;
            await remove(meta);
        },
        [metas, page?.id, remove]
    );

    const handleUpdateMeta = React.useCallback(
        async (id: string, payload: Partial<PageMeta>) => {
            if (!page?.id) return;
            const meta = metas.find(x => x.id === id);
            if (!meta) return;
            const updatedMeta = { ...meta, ...payload };
            await update(updatedMeta);
        },
        [metas, page?.id, update]
    );

    return (
        <Box fullWidth fullHeight overflow="hidden">
            <Box direction="row" px={2} mb={1} gap={1} align="center" fullWidth>
                <IconButton icon="AddIcon" variant="icon-bordered" onClick={handleAddMeta} disabled={!page?.id} />
            </Box>
            <Box gap={3} p={2} fullWidth fullHeight overflow="scroll">
                {metas.map(({ id, key, value, content }) => (
                    <Box key={id} direction="row" gap={1} align="start" justify="space-between" fullWidth fullHeight>
                        <Box gap={1} fullWidth>
                            <Box
                                className={`${baseFieldsClassName}-Meta`}
                                direction="row"
                                gap={1}
                                align="start"
                                fullWidth
                            >
                                <InputSelect
                                    label="key"
                                    value={key}
                                    options={['name', 'property']}
                                    onChange={v => handleUpdateMeta(id, { key: v })}
                                    onRender={t => t}
                                    required
                                />
                                <InputText
                                    label={key ?? 'name'}
                                    value={value}
                                    maxLength={128}
                                    onChange={v => handleUpdateMeta(id, { value: v })}
                                    fullWidth
                                />
                            </Box>
                            <InputText
                                label="content"
                                type="area"
                                value={content}
                                maxLength={256}
                                onChange={v => handleUpdateMeta(id, { content: v })}
                                fullWidth
                            />
                        </Box>
                        <Box
                            className={`${baseFieldsClassName}-Meta-Actions`}
                            mt={2}
                            gap={1}
                            align="center"
                            justify="center"
                        >
                            <IconButton icon="TrashIcon" onClick={() => handleDeleteMeta(id)} disabled={!page?.id} />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
