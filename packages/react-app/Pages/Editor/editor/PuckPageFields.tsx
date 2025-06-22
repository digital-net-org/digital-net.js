import React from 'react';
import { Puck, usePuck } from '@measured/puck';
import type { Page } from '@digital-net/core';
import {
    type InputSwitchProps,
    type InputTextProps,
    Text,
    Box,
    InputText,
    InputSwitch,
    IconButton,
} from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { EditorApiHelper, useEditorContext, usePageStore } from '../state';
import { EditorHelper } from '@digital-net/react-app/Pages/Editor/editor/EditorHelper';

export function PuckPageFields() {
    const { appState, dispatch } = usePuck();
    const { page } = useEditorContext();
    const { save, get, outdatedQueries } = usePageStore();

    const [fieldsState, setFieldsState] = React.useState<'page' | 'components'>('page');
    const [storedEntity, setStoredEntity] = React.useState<Page | undefined>(undefined);
    const updateState = React.useCallback(async (id: string | number) => setStoredEntity(await get(id)), [get]);

    const selectedComponentName = React.useMemo(
        () =>
            appState.ui.itemSelector?.index !== undefined
                ? appState.data.content[appState.ui.itemSelector.index]
                : null,
        [appState.data.content, appState.ui.itemSelector]
    );

    React.useEffect(() => {
        (async () => (page?.id ? await updateState(page.id) : void 0))();
    }, [updateState, page?.id]);

    React.useEffect(() => {
        (async () =>
            page?.id && outdatedQueries.includes(`${EditorApiHelper.store}:${page.id}`)
                ? await updateState(page.id)
                : void 0)();
    }, [updateState, outdatedQueries, page?.id]);

    React.useEffect(() => setFieldsState(appState.ui.itemSelector ? 'components' : 'page'), [appState.ui.itemSelector]);

    React.useEffect(
        () => (!appState.ui.itemSelector && fieldsState === 'components' ? setFieldsState('page') : void 0),
        [appState.ui.itemSelector, fieldsState]
    );

    const handleChange = (key: keyof Page, value: string | boolean | undefined) => {
        if (page?.id) {
            save(page.id, prev => ({ ...page, ...prev, [key]: value ?? '' })).then();
        }
    };

    const handleFieldsStateChange = (state: 'page' | 'components') => {
        if (state === 'components' && !appState.ui.itemSelector) {
            dispatch({ type: 'setUi', ui: prev => ({ ...prev, itemSelector: { ...prev.itemSelector, index: 0 } }) });
        }
        setFieldsState(state);
    };

    return (
        <Box p={2} fullWidth>
            <Box direction="row" mb={2} justify="space-between" align="center" fullWidth>
                <Text variant="caption">
                    {fieldsState === 'components'
                        ? (selectedComponentName?.type ?? null)
                        : Localization.translate('page-editor:tools.page-metas.title')}
                </Text>
                <Box direction="row" gap={1}>
                    {(['components', 'page'] as const).map(state => (
                        <IconButton
                            icon={state === 'components' ? 'PencilSquare' : 'FileIcon'}
                            onClick={() => handleFieldsStateChange(state)}
                            selected={fieldsState === state}
                        />
                    ))}
                </Box>
            </Box>
            {fieldsState === 'components' ? (
                <Puck.Fields />
            ) : (
                <Box gap={2} fullWidth>
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
                            value={storedEntity?.[name] ?? page?.[name]}
                            {...props}
                        />
                    ))}
                    <Box className={`${EditorHelper.className}-Page-Fields`} gap={2} pt={2} fullWidth>
                        {(
                            [{ name: 'isIndexed' }, { name: 'isPublished' }] satisfies Array<
                                Partial<InputSwitchProps & { name: keyof Page }>
                            >
                        ).map(({ name }) => (
                            <Box direction="row" justify="space-between" align="center" fullWidth>
                                <Text>{Localization.translate(`page-editor:fields.${name}.label`)}</Text>
                                <InputSwitch
                                    key={name}
                                    name={name}
                                    onChange={value => handleChange(name, value)}
                                    value={Boolean(storedEntity?.[name] ?? page?.[name])}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
