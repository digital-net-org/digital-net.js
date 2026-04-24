import * as React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { styled, css } from '@mui/material/styles';
import { UrlParamBuilder, useUrlQueryState } from '../../router';
import { DnEntityViewTabs, type DnEntityViewTab } from './DnEntityViewTabs';

export type { DnEntityViewTab };

export interface DnEntityViewProps {
    title: string;
    description?: string;
    tabs?: DnEntityViewTab[];
    children?: React.ReactNode;
    isNew?: boolean;
    isSaving?: boolean;
    isDirty?: boolean;
    hasConflict?: boolean;
    baselineUpdatedAt?: string | null;
    apiUpdatedAt?: string | null;
    onSave?: () => void | Promise<void>;
    onDelete?: () => void | Promise<void>;
    onReload?: () => void | Promise<void>;
}

export function DnEntityView({
    title,
    description,
    tabs,
    children,
    isNew = false,
    isSaving = false,
    isDirty = false,
    hasConflict = false,
    baselineUpdatedAt,
    apiUpdatedAt,
    onSave,
    onDelete,
    onReload,
}: DnEntityViewProps) {
    const [{ tab }, setState] = useUrlQueryState({
        tab: UrlParamBuilder.buildString(tabs?.length ? tabs[0].key : '', 'tab'),
    });
    const activeTab = tabs?.length ? (tabs.find(t => t.key === tab) ?? tabs[0]) : null;
    const [isPending, startTransition] = React.useTransition();

    React.useEffect(
        () => (tabs?.length && activeTab && activeTab.key !== tab ? setState({ tab: activeTab.key }) : void 0),
        [activeTab, tab, setState, tabs?.length]
    );

    return (
        <View>
            <Stack>
                <Stack sx={{ pb: 2 }}>
                    <Stack direction="row" sx={{ alignItems: 'baseline', gap: 2 }}>
                        <Typography variant="h2">{title}</Typography>
                        {isDirty ? (
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'warning.main' }}>
                                (changements non sauvegardés)
                            </Typography>
                        ) : null}
                    </Stack>
                    {description ? (
                        <Typography variant="body2" sx={{ ml: 0.35, mt: 1 }}>
                            {description}
                        </Typography>
                    ) : null}
                </Stack>
                <Divider />
            </Stack>
            {tabs?.length && activeTab ? (
                <DnEntityViewTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={key => startTransition(() => setState({ tab: key }))}
                    isPending={isPending}
                    isNew={isNew}
                    isSaving={isSaving}
                    isDirty={isDirty}
                    hasConflict={hasConflict}
                    baselineUpdatedAt={baselineUpdatedAt}
                    apiUpdatedAt={apiUpdatedAt}
                    onSave={onSave}
                    onDelete={onDelete}
                    onReload={onReload}
                />
            ) : (
                children
            )}
        </View>
    );
}

const View = styled(Stack)(
    () => css`
        width: 100%;
        height: 100%;
        overflow-y: hidden;
    `
);
