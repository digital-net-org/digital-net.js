import * as React from 'react';
import { css, styled } from '@mui/material/styles';
import { DnAppBar, DnAppDrawer } from '@digital-net-org/digital-ui';

export interface DnAppLayoutProps {
    children?: React.ReactNode;
}

export function DnAppLayout({ children }: DnAppLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    return (
        <Layout>
            <DnAppDrawer open={isMenuOpen}>Coucou</DnAppDrawer>
            <MainWrapper>
                <DnAppBar
                    url="home/test"
                    slots={{
                        menu: {
                            open: isMenuOpen,
                            onClick: () => setIsMenuOpen(!isMenuOpen),
                        },
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
