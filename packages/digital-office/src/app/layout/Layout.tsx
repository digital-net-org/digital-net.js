import * as React from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router';
import { css, styled } from '@mui/material/styles';
import { ErrorBoundary, LayoutNav, type LayoutNavProps } from './components';
import { useLayout } from './LayoutProvider';
import { DnAppBar, DnAppDrawer } from '../../ui';
import { useDigitalNetUser } from '../user';

interface Props {
    navigation: LayoutNavProps['navigation'];
    routePatterns?: string[];
    children?: React.ReactNode;
}

export function Layout({ navigation, routePatterns, children }: Props) {
    const location = useLocation();
    const navigate = useNavigate();

    const { isDrawerOpen, toggleDrawer } = useLayout();
    const { user, isLogged, isLoading, isAdmin, logout } = useDigitalNetUser();

    const isPathClickable = React.useCallback(
        (path: string) => (routePatterns ?? []).some(p => matchPath(p, path) !== null),
        [routePatterns]
    );

    return (
        <App>
            {isLogged ? (
                <DnAppDrawer open={isDrawerOpen}>
                    <LayoutNav navigation={navigation} />
                </DnAppDrawer>
            ) : null}
            <AppViewWrapper>
                <DnAppBar
                    slots={{
                        menu: {
                            open: isDrawerOpen,
                            onClick: toggleDrawer,
                        },
                        account: {
                            username: user?.username,
                            loading: isLoading,
                            onLogoutClick: logout,
                            isAdmin,
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
