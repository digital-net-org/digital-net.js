import * as React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { css, styled } from '@mui/material/styles';
import { DnAppBar, DnAppDrawer } from '@digital-net-org/digital-ui';
import { DnAppLayoutNav, type DnAppLayoutNavProps } from './DnAppLayoutNav';
import { useDnApp } from './DnAppProvider';
import { useDnUser } from '../user';

export interface DnAppLayoutProps {
    navigation: DnAppLayoutNavProps['navigation'];
    children?: React.ReactNode;
}

export function DnAppLayout({ navigation, children }: DnAppLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const { isDrawerOpen, toggleDrawer } = useDnApp();
    const { user, isLogged, isLoading, logout } = useDnUser();

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
                        },
                        breadcrumbs: {
                            url: location.pathname,
                            onHomeClick: () => navigate('/'),
                            onClick: navigate,
                        },
                    }}
                    disableSlots={{
                        account: !isLogged,
                        menu: !isLogged,
                        breadcrumb: !isLogged,
                    }}
                />
                <Main>{children}</Main>
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
    `
);
