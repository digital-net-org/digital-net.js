import * as React from 'react';
import { Alert, CircularProgress, Link, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon, Save as SaveIcon } from '@mui/icons-material';
import { DnDialog, DnIconButton } from '../../ui';
import { formatDate } from './formatDate';
import { css, styled } from '@mui/material/styles';

export interface DnEntityViewTab {
    key: string;
    label: string;
    content: React.ReactNode;
}

export interface DnEntityViewTabsProps {
    tabs: DnEntityViewTab[];
    activeTab: DnEntityViewTab;
    onTabChange: (_key: string) => void;
    isPending?: boolean;
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

export function DnEntityViewTabs({
    tabs,
    activeTab,
    onTabChange,
    isPending = false,
    isNew = false,
    isSaving = false,
    isDirty = false,
    hasConflict = false,
    baselineUpdatedAt,
    apiUpdatedAt,
    onSave,
    onDelete,
    onReload,
}: DnEntityViewTabsProps) {
    const [reloadDialogOpen, setReloadDialogOpen] = React.useState(false);

    const confirmReload = React.useCallback(async () => {
        setReloadDialogOpen(false);
        if (onReload) await onReload();
    }, [onReload]);

    const hasActions = Boolean(onSave || onDelete || onReload);
    const saveDisabled = !isDirty || hasConflict || isSaving;
    const discardDisabled = !isDirty || isSaving;

    return (
        <React.Fragment>
            <TabsWrapper>
                <Tabs value={activeTab.key} onChange={(_, v) => onTabChange(v)}>
                    {tabs.map(t => (
                        <Tab key={t.key} value={t.key} label={t.label} />
                    ))}
                </Tabs>
                {hasActions ? (
                    <ActionsWrapper>
                        {isSaving ? <CircularProgress size={20} /> : null}
                        {onSave ? (
                            <DnIconButton tooltip="Enregistrer" disabled={saveDisabled} onClick={() => void onSave()}>
                                <SaveIcon />
                            </DnIconButton>
                        ) : null}
                        {onReload ? (
                            <DnIconButton
                                tooltip="Annuler les modifications locales"
                                disabled={discardDisabled}
                                onClick={() => setReloadDialogOpen(true)}
                            >
                                <RefreshIcon />
                            </DnIconButton>
                        ) : null}
                        {onDelete && !isNew ? (
                            <DnIconButton tooltip="Supprimer" disabled={isSaving} onClick={() => void onDelete()}>
                                <DeleteIcon />
                            </DnIconButton>
                        ) : null}
                    </ActionsWrapper>
                ) : null}
            </TabsWrapper>
            {hasConflict ? (
                <Alert severity="warning" variant="outlined" sx={{ mt: 1 }}>
                    <Typography variant="body2">
                        Cette entité a été modifiée ailleurs depuis le début de votre édition locale.
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ mt: 0.5 }}>
                        Modifiée côté serveur : {formatDate(apiUpdatedAt)} · Vos modifications depuis :{' '}
                        {formatDate(baselineUpdatedAt)}
                    </Typography>
                    {onReload ? (
                        <Link
                            component="button"
                            type="button"
                            onClick={() => setReloadDialogOpen(true)}
                            sx={{ mt: 0.5 }}
                        >
                            Recharger les données
                        </Link>
                    ) : null}
                </Alert>
            ) : null}
            <ContentWrapper sx={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 150ms' }}>
                {activeTab.content}
            </ContentWrapper>
            <DnDialog
                open={reloadDialogOpen}
                onClose={() => setReloadDialogOpen(false)}
                onConfirm={confirmReload}
                confirmLabel="Recharger"
                title="Recharger les données"
            >
                Attention, vos modifications locales seront perdues. Continuer ?
            </DnDialog>
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
