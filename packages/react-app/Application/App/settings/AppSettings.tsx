import React from 'react';
import { Dialog } from '@digital-lib/react-digital-ui';
import { Localization } from '../../../Localization';
import { Panel } from './components';
import { defaultViews } from './views';
import { AppSettingsContext } from './AppSettingsProvider';
import './AppSettings.styles.css';

export interface AppSettingsProps {
    views?: Record<string, React.ReactNode>;
    onLabelRender?: (key: string) => string;
}

export function AppSettings({ onLabelRender, views, ...props }: AppSettingsProps) {
    const options = React.useMemo(
        () => ({
            ...defaultViews,
            ...(views ?? {}),
        }),
        [views]
    );

    const { state, open, close, navigate } = React.useContext(AppSettingsContext);
    const isDefault = React.useMemo(() => (state ? Object.keys(defaultViews).includes(state) : false), [state]);

    return (
        <React.Fragment>
            <Dialog open={open} onClose={close} {...props} className="DigitalUi-AppSettings">
                <Dialog.Header>
                    {isDefault
                        ? Localization.translate(`app:settings.user.${state}.label`)
                        : onLabelRender?.(state ?? '')}
                </Dialog.Header>
                <Dialog.Panel>
                    <Panel>
                        <Panel.Nav
                            value={state}
                            options={Object.keys(defaultViews)}
                            onSelect={navigate}
                            label={Localization.translate('app:settings.user.label')}
                            onRender={str => Localization.translate(`app:settings.user.${str}.label`)}
                        />
                        {views !== undefined && (
                            <Panel.Nav
                                value={state}
                                options={Object.keys(views)}
                                onSelect={navigate}
                                label={Localization.translate('app:settings.application.label')}
                                onRender={str => onLabelRender?.(str)}
                            />
                        )}
                    </Panel>
                </Dialog.Panel>
                <Dialog.Content>{open && state ? options[state] : null}</Dialog.Content>
            </Dialog>
        </React.Fragment>
    );
}
