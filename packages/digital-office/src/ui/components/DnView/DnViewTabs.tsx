import * as React from 'react';
import { Stack, Tab, Tabs } from '@mui/material';
import { css, styled } from '@mui/material/styles';
import { UrlParamBuilder, useUrlQueryState } from '../../../navigation';
import { type DnViewTab } from './DnView';

interface DnViewTabsProps {
    items: DnViewTab[];
    renderActions?: React.ReactNode;
    renderBanner?: React.ReactNode;
}

export function DnViewTabs({ items, renderActions, renderBanner }: DnViewTabsProps) {
    const [{ tab }, setState] = useUrlQueryState({
        tab: UrlParamBuilder.buildString(items[0]?.key ?? '', 'tab'),
    });
    const activeTab = items.find(t => t.key === tab) ?? items[0];
    const [isPending, startTransition] = React.useTransition();

    React.useEffect(
        () => (activeTab && activeTab.key !== tab ? setState({ tab: activeTab.key }) : void 0),
        [activeTab, tab, setState]
    );

    const handleTabChange = React.useCallback(
        (key: string) => startTransition(() => setState({ tab: key })),
        [setState]
    );

    return (
        <React.Fragment>
            <TabsWrapper>
                <Tabs value={activeTab.key} onChange={(_, v) => handleTabChange(v)}>
                    {items.map(t => (
                        <Tab key={t.key} value={t.key} label={t.label} disabled={t.disabled} />
                    ))}
                </Tabs>
                {renderActions ? <ActionsWrapper>{renderActions}</ActionsWrapper> : null}
            </TabsWrapper>
            {renderBanner}
            {items.map(t => {
                const isActive = t.key === activeTab.key;
                return (
                    <ContentWrapper
                        key={t.key}
                        sx={{
                            display: isActive ? undefined : 'none',
                            opacity: isPending && isActive ? 0.5 : 1,
                            transition: 'opacity 150ms',
                        }}
                    >
                        {t.content}
                    </ContentWrapper>
                );
            })}
        </React.Fragment>
    );
}

const ActionsWrapper = styled(Stack)(
    () => css`
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        padding-right: 0.5rem;
    `
);

const TabsWrapper = styled(Stack)(
    () => css`
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    `
);

const ContentWrapper = styled(Stack)(
    () => css`
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        padding-top: 1.25rem;
    `
);
