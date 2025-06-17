import React from 'react';
import { Dialog } from '@digital-net/react-digital-ui';
import { Localization } from '../../Localization';
import { SettingsContext } from './SettingsProvider';
import { AppSettingsPanel } from './components';
import { PreferencesView, UserView } from './views';
import './AppSettings.styles.css';

export const views = {
    user: {
        account: <UserView />,
        preferences: <PreferencesView />,
    },
};

export function AppSettings() {
    const { state, open, close, navigate } = React.useContext(SettingsContext);
    const settingFolder = React.useMemo(() => {
        for (const folder in views) {
            if (views[folder][state]) {
                return folder as keyof typeof views;
            }
        }
    }, [state]);

    return (
        <React.Fragment>
            <Dialog open={open} onClose={close} className="DigitalUi-AppSettings">
                <Dialog.Header>{Localization.translate(`app-settings:${settingFolder}.${state}.label`)}</Dialog.Header>
                <Dialog.Panel>
                    <AppSettingsPanel>
                        <AppSettingsPanel.Nav
                            value={state}
                            options={Object.keys(views.user)}
                            onSelect={navigate}
                            label={Localization.translate('app-settings:user.label')}
                            onRender={key => Localization.translate(`app-settings:user.${key}.label`)}
                        />
                    </AppSettingsPanel>
                </Dialog.Panel>
                <Dialog.Content>{open && state && settingFolder ? views[settingFolder][state] : null}</Dialog.Content>
            </Dialog>
        </React.Fragment>
    );
}
