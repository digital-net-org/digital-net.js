import * as React from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router';
import { css, styled } from '@mui/material/styles';
import { DnAppBar, DnAppDrawer } from '../ui';
import { DnAppLayoutNav, type DnAppLayoutNavProps } from './DnAppLayoutNav';
import { DnErrorBoundary } from './DnErrorBoundary';
import { useDnApp } from './DnAppProvider';
import { useDnUser } from '../user';

export interface DnAppLayoutProps {
    navigation: DnAppLayoutNavProps['navigation'];
    routePatterns?: string[];
    children?: React.ReactNode;
}

export function DnAppLayout({ navigation, routePatterns, children }: DnAppLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const { isDrawerOpen, toggleDrawer } = useDnApp();
    const { user, isLogged, isLoading, isAdmin, logout } = useDnUser();

    const isPathClickable = React.useCallback(
        (path: string) => (routePatterns ?? []).some(p => matchPath(p, path) !== null),
        [routePatterns]
    );

    return (
        <Layout>
            {isLogged ? (
                <DnAppDrawer open={isDrawerOpen}>
                    <DnAppLayoutNav navigation={navigation} />
                </DnAppDrawer>
            ) : null}
            <MainWrapper>
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
                <Main>
                    <DnErrorBoundary key={location.pathname}>{children}</DnErrorBoundary>
                </Main>
            </MainWrapper>
        </Layout>
    );
}

const Layout = styled('div')(
    () => css`
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
    `
);

const MainWrapper = styled('div')(
    () => css`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    `
);

const Main = styled('main')(
    () => css`
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 1rem;
    `
);
