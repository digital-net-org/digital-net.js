import * as React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { urlString, useUrlQueryState } from '../useUrlQueryState';
import { DnView } from '../../ui';

export interface DnEntityViewTab {
    key: string;
    label: string;
    content: React.ReactNode;
}

export interface DnEntityViewProps {
    title: string;
    description?: string;
    tabs?: DnEntityViewTab[];
    children?: React.ReactNode;
}

export function DnEntityView({ title, description, tabs, children }: DnEntityViewProps) {
    const [{ tab }, setState] = useUrlQueryState({ tab: urlString(tabs?.length ? tabs[0].key : '', 'tab') });
    const activeTab = tabs?.length ? (tabs.find(t => t.key === tab) ?? tabs[0]) : null;

    React.useEffect(
        () => (tabs?.length && activeTab && activeTab.key !== tab ? setState({ tab: activeTab.key }) : void 0),
        [activeTab, tab, setState, tabs?.length]
    );

    return (
        <DnView title={title} description={description}>
            {tabs?.length && activeTab ? (
                <React.Fragment>
                    <Tabs value={activeTab.key} onChange={(_, v) => setState({ tab: v })}>
                        {tabs.map(t => (
                            <Tab key={t.key} value={t.key} label={t.label} />
                        ))}
                    </Tabs>
                    <Box sx={{ pt: 2 }}>{activeTab.content}</Box>
                </React.Fragment>
            ) : (
                children
            )}
        </DnView>
    );
}
