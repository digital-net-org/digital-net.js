import * as React from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router';
import { css, styled } from '@mui/material/styles';
import { ErrorBoundary, LayoutNav, type LayoutNavProps } from './components';
import { useLayout } from './useLayout';
import { DnAppBar, DnAppDrawer } from '../../ui';
import { useDigitalNetUser } from '../user';
import { Settings } from './Settings';

interface Props {
    navigation: LayoutNavProps['navigation'];
    routePatterns?: string[];
    children?: React.ReactNode;
}

export function Layout({ navigation, routePatterns, children }: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    const { isDrawerOpen, toggleDrawer, setIsUserSettingsOpen } = useLayout();
    const { user, isLogged, isLoading, isAdmin, logout } = useDigitalNetUser();

    const isPathClickable = React.useCallback(
        (path: string) => (routePatterns ?? []).some(p => matchPath(p, path) !== null),
        [routePatterns]
    );

    const openSettings = () => setIsUserSettingsOpen(true);

    return (
        <App>
            {isLogged ? (
                <React.Fragment>
                    <Settings />
                    <DnAppDrawer open={isDrawerOpen}>
                        <LayoutNav navigation={navigation} />
                    </DnAppDrawer>
                </React.Fragment>
            ) : null}
            <AppViewWrapper>
                <DnAppBar
                    slots={{
                        menu: {
                            open: isDrawerOpen,
                            onClick: toggleDrawer,
                        },
                        settings: {
                            onClick: openSettings,
                        },
                        account: {
                            username: user?.username,
                            imgSrc: undefined,
                            loading: isLoading,
                            onMyAccountClick: openSettings,
                            onLogoutClick: logout,
                            isAdmin: Boolean(isAdmin),
                        },
                        breadcrumbs: {
                            url: location.pathname,
                            onHomeClick: () => navigate('/'),
                            onClick: navigate,
                            isPathClickable,
                        },
                    }}
                    disableSlots={{
                        account: !isLogged,
                        menu: !isLogged,
                        settings: !isLogged,
                        breadcrumb: !isLogged,
                    }}
                />
                <AppView>
                    <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>
                </AppView>
            </AppViewWrapper>
        </App>
    );
}

const App = styled('div')(
    () => css`
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
    `
);

const AppViewWrapper = styled('div')(
    () => css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    `
);

const AppView = styled('main')(
    () => css`
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 1rem;
    `
);
