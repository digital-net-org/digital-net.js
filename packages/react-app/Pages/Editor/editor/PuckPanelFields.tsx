import React from 'react';
import { Puck, usePuck } from '@measured/puck';
import { Text, Box, IconButton } from '@digital-net/react-digital-ui';
import { Localization } from '../../../Localization';
import { PuckPanelFieldsPage } from './PuckPanelFieldsPage';
import { PuckPanelFieldsMetas } from './PuckPanelFieldsMetas';
import { EditorHelper } from './EditorHelper';

type PuckPanelField = 'page' | 'components' | 'metas';
export const baseFieldsClassName = `${EditorHelper.className}-Fields`;

export function PuckPanelFields() {
    const { appState, dispatch } = usePuck();
    const [fieldsState, setFieldsState] = React.useState<PuckPanelField>('page');

    const selectedComponentName = React.useMemo(
        () =>
            appState.ui.itemSelector?.index !== undefined
                ? appState.data.content[appState.ui.itemSelector.index]
                : null,
        [appState.data.content, appState.ui.itemSelector]
    );

    React.useEffect(() => {
        setFieldsState(appState.ui.itemSelector ? 'components' : 'page');
    }, [appState.ui.itemSelector]);

    React.useEffect(
        () => (!appState.ui.itemSelector && fieldsState === 'components' ? setFieldsState('page') : void 0),
        [appState.ui.itemSelector, fieldsState]
    );

    const handleFieldsStateChange = (state: 'page' | 'components' | 'metas') => {
        if (state === 'components' && !appState.ui.itemSelector) {
            dispatch({ type: 'setUi', ui: prev => ({ ...prev, itemSelector: { ...prev.itemSelector, index: 0 } }) });
        }
        setFieldsState(state);
    };

    return (
        <Box className={baseFieldsClassName} fullWidth fullHeight overflow="hidden">
            <Box direction="row" p={2} justify="space-between" align="center" fullWidth overflow="hidden">
                <Text variant="caption">
                    {fieldsState === 'components'
                        ? (selectedComponentName?.type ?? null)
                        : Localization.translate(`page-editor:tools.fields.${fieldsState}.title`)}
                </Text>
                <Box direction="row" gap={1} overflow="scroll">
                    {(['components', 'page', 'metas'] satisfies PuckPanelField[]).map(state => (
                        <IconButton
                            key={state}
                            icon={
                                (
                                    {
                                        components: 'PencilSquare',
                                        page: 'FileIcon',
                                        metas: 'MetasIcon',
                                    } as const
                                )[state]
                            }
                            onClick={() => handleFieldsStateChange(state)}
                            selected={fieldsState === state}
                            disabled={state === 'components' && appState.data.content.length === 0}
                        />
                    ))}
                </Box>
            </Box>
            {(() => {
                if (fieldsState === 'components') {
                    return (
                        <Box p={2} fullWidth fullHeight overflow="scroll">
                            <Puck.Fields />
                        </Box>
                    );
                }
                if (fieldsState === 'page') {
                    return <PuckPanelFieldsPage />;
                }
                if (fieldsState === 'metas') {
                    return <PuckPanelFieldsMetas />;
                }
            })()}
        </Box>
    );
}
