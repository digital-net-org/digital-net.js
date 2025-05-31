import React, { type PropsWithChildren } from 'react';
import { Box, Button, Icon } from '@digital-net/react-digital-ui';
import { Localization } from '../../Localization';
import { useApplicationUser } from '../../User';
import { ThemeSwitch } from '../../Theme';
import { useDigitalRouter } from '../../Router';
import { Actions } from './actions';
import { AppSettings, type AppSettingsProps } from './settings';
import './fontsources';
import './App.styles.css';
import './AppBar.styles.css';
import { defaultViews } from './settings/views';
import { type AppAlertsProps, AppAlerts } from './alerts';
import { useDigitalApp } from './useDigitalApp';

export interface AppProps extends PropsWithChildren {
    settingsViews?: {
        views: AppSettingsProps['views'];
        onLabelRender: AppSettingsProps['onLabelRender'];
    };
    alerts?: AppAlertsProps['alerts'];
}

export function App({ children, settingsViews, alerts }: AppProps) {
    const { current } = useDigitalRouter();
    const { isLogged } = useApplicationUser();
    const { openAppSettings } = useDigitalApp();

    return (
        <main className="Page">
            {isLogged && !current?.isPublic && (
                <React.Fragment>
                    <header className="DigitalUi-AppBar">
                        <Actions.Navigation />
                        <Box justify="center" fullWidth>
                            {Localization.translate(`router:page.title.${current?.path}`)}
                        </Box>
                        <Box>
                            <AppAlerts alerts={alerts ?? []} />
                            <Actions.User />
                            <ThemeSwitch />
                            <Button variant="icon" onClick={() => openAppSettings(Object.keys(defaultViews)[0])}>
                                <Icon.GearIcon variant="filled" />
                            </Button>
                        </Box>
                    </header>
                    <AppSettings {...settingsViews} />
                </React.Fragment>
            )}
            {children}
        </main>
    );
}
