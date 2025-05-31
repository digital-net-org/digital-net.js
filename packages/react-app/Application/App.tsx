import React, { type PropsWithChildren } from 'react';
import { Box, Button, Icon } from '@digital-net/react-digital-ui';
import { Localization } from '../Localization';
import { useApplicationUser } from '../User';
import { ThemeSwitch } from '../Theme';
import { useDigitalRouter } from '../Router';
import { useDigitalApp } from './useDigitalApp';
import { AppAlerts } from './AppAlerts';
import { AppActions } from './AppActions';
import { AppSettings } from './AppSettings';
import './fontsources';
import './App.styles.css';
import './AppBar.styles.css';
import { useAppAlerts } from './useAppAlerts';

export function App({ children }: PropsWithChildren) {
    const { current } = useDigitalRouter();
    const { isLogged } = useApplicationUser();
    const { openAppSettings } = useDigitalApp();
    const alerts = useAppAlerts();

    return (
        <main className="Page">
            {isLogged && !current?.isPublic && (
                <React.Fragment>
                    <header className="DigitalUi-AppBar">
                        <AppActions.Navigation />
                        <Box justify="center" fullWidth>
                            {Localization.translate(`router:page.title.${current?.path}`)}
                        </Box>
                        <Box>
                            <AppAlerts alerts={alerts} />
                            <AppActions.User />
                            <ThemeSwitch />
                            <Button variant="icon" onClick={() => openAppSettings('account')}>
                                <Icon.GearIcon variant="filled" />
                            </Button>
                        </Box>
                    </header>
                    <AppSettings />
                </React.Fragment>
            )}
            {children}
        </main>
    );
}
