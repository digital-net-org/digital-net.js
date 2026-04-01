import * as React from 'react';
import { DnAppBar, DnMenuAccount, DnMenuSettings, DnMenuTheme } from '@digital-net-org/digital-ui';

export interface DnAppLayoutProps {
    children?: React.ReactNode;
}

export function DnAppLayout({ children }: DnAppLayoutProps) {
    return (
        <React.Fragment>
            <DnAppBar
                flat
                url="home/test"
                renderActions={() => (
                    <React.Fragment>
                        <DnMenuAccount />
                        <DnMenuTheme />
                        <DnMenuSettings />
                    </React.Fragment>
                )}
            />
            {children}
        </React.Fragment>
    );
}
