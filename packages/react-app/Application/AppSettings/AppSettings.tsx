import React from 'react';
import { Dialog } from '@digital-net/react-digital-ui';
import { Localization } from '../../Localization';
import { SettingsContext } from './SettingsProvider';
import { AppSettingsPanel } from './components';
import { PreferencesView, UserView, PuckConfigView } from './views';
import './AppSettings.styles.css';

export const views = {
    userViews: {
        account: <UserView />,
        preferences: <PreferencesView />,
    },
    pagesViews: {
        'pages-puck': <PuckConfigView />,
    },
};

export function AppSettings() {
    const { state, open, close, navigate } = React.useContext(SettingsContext);
    const settingFolder = React.useMemo(() => {
        if (!state) {
            return null;
        }
        if (views.userViews[state]) {
            return 'user';
        }
        if (views.pagesViews[state]) {
            return 'pages';
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
                            options={Object.keys(views.userViews)}
                            onSelect={navigate}
                            label={Localization.translate('app-settings:user.label')}
                            onRender={key => Localization.translate(`app-settings:user.${key}.label`)}
                        />
                        <AppSettingsPanel.Nav
                            value={state}
                            options={Object.keys(views.pagesViews)}
                            onSelect={navigate}
                            label={Localization.translate('app-settings:pages.label')}
                            onRender={key => Localization.translate(`app-settings:pages.${key}.label`)}
                        />
                    </AppSettingsPanel>
                </Dialog.Panel>
                <Dialog.Content>{open && state ? views[state] : null}</Dialog.Content>
            </Dialog>
        </React.Fragment>
    );
}
