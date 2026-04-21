import * as React from 'react';
import { Alert, CircularProgress, Link, Stack, Tab, Tabs, Typography } from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon, Save as SaveIcon } from '@mui/icons-material';
import { DnDialog, DnIconButton } from '../../ui';
import { formatDate } from './formatDate';

export interface DnEntityViewTab {
    key: string;
    label: string;
    content: React.ReactNode;
}

export interface DnEntityViewTabsProps {
    tabs: DnEntityViewTab[];
    activeTab: DnEntityViewTab;
    onTabChange: (_key: string) => void;
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
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
                <Tabs value={activeTab.key} onChange={(_, v) => onTabChange(v)}>
                    {tabs.map(t => (
                        <Tab key={t.key} value={t.key} label={t.label} />
                    ))}
                </Tabs>
                {hasActions ? (
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, pr: 1 }}>
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
                    </Stack>
                ) : null}
            </Stack>
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
            <Stack sx={{ pt: 2, height: '100%' }}>{activeTab.content}</Stack>
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
