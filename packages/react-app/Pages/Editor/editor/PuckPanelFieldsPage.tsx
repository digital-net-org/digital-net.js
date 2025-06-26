import React from 'react';
import type { Page } from '@digital-net/core';
import {
    type InputSwitchProps,
    type InputTextProps,
    Text,
    Box,
    InputText,
    InputSwitch,
} from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { EditorApiHelper, useEditorContext, usePageStore } from '../state';
import { EditorHelper } from './EditorHelper';

export function PuckPanelFieldsPage() {
    const { page } = useEditorContext();
    const { save, get, outdatedQueries } = usePageStore();

    const [storedPage, setStoredPage] = React.useState<Page | undefined>(undefined);
    const updateState = React.useCallback(async (id: string) => setStoredPage(await get(id)), [get]);

    React.useEffect(() => {
        (async () => (page?.id ? await updateState(page.id) : void 0))();
    }, [updateState, page?.id]);

    React.useEffect(() => {
        (async () =>
            page?.id && outdatedQueries.includes(`${EditorApiHelper.store}:${page.id}`)
                ? await updateState(page.id)
                : void 0)();
    }, [updateState, outdatedQueries, page?.id]);

    const handleChange = (key: keyof Page, value: string | boolean | undefined) => {
        if (page?.id) {
            save(page.id, prev => ({ ...page, ...prev, [key]: value ?? '' })).then();
        }
    };
    return (
        <Box gap={2} p={2} fullWidth fullHeight overflow="scroll">
            {(
                [
                    { name: 'path', maxLength: 2068 },
                    { name: 'title', maxLength: 64 },
                    { name: 'description', maxLength: 256, type: 'area' },
                ] satisfies Array<Partial<InputTextProps & { name: keyof Page }>>
            ).map(({ name, ...props }) => (
                <InputText
                    key={name}
                    fullWidth
                    label={Localization.translate(`page-editor:fields.${name}.label`)}
                    help={Localization.translate(`page-editor:fields.${name}.tooltip`)}
                    onChange={value => handleChange(name, value)}
                    value={storedPage?.[name] ?? page?.[name]}
                    {...props}
                />
            ))}
            <Box className={`${EditorHelper.className}-Page-Fields`} gap={2} pt={2} fullWidth>
                {(
                    [{ name: 'isIndexed' }, { name: 'isPublished' }] satisfies Array<
                        Partial<InputSwitchProps & { name: keyof Page }>
                    >
                ).map(({ name }) => (
                    <Box key={name} direction="row" justify="space-between" align="center" fullWidth>
                        <Text>{Localization.translate(`page-editor:fields.${name}.label`)}</Text>
                        <InputSwitch
                            key={name}
                            name={name}
                            onChange={value => handleChange(name, value)}
                            value={Boolean(storedPage?.[name] ?? page?.[name])}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
