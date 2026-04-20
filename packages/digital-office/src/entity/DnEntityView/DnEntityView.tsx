import * as React from 'react';
import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    IconButton,
    Link,
    Stack,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from '@mui/material';
import { styled, css } from '@mui/material/styles';
import { Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import { UrlParamBuilder, useUrlQueryState } from '../../router';
import { DnDialog } from '../../ui';

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

function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
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
    const [reloadDialogOpen, setReloadDialogOpen] = React.useState(false);

    React.useEffect(
        () => (tabs?.length && activeTab && activeTab.key !== tab ? setState({ tab: activeTab.key }) : void 0),
        [activeTab, tab, setState, tabs?.length]
    );

    const confirmReload = React.useCallback(async () => {
        setReloadDialogOpen(false);
        if (onReload) await onReload();
    }, [onReload]);

    const hasActions = Boolean(onSave || onDelete);

    return (
        <View>
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
            {tabs?.length && activeTab ? (
                <React.Fragment>
                    <Stack
                        direction="row"
                        sx={{ justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}
                    >
                        <Tabs value={activeTab.key} onChange={(_, v) => setState({ tab: v })}>
                            {tabs.map(t => (
                                <Tab key={t.key} value={t.key} label={t.label} />
                            ))}
                        </Tabs>
                        {hasActions ? (
                            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, pr: 1 }}>
                                {isSaving ? <CircularProgress size={20} /> : null}
                                {onSave
                                    ? (() => {
                                          const saveDisabled = !isDirty || hasConflict || isSaving;
                                          return (
                                              <Tooltip
                                                  title={saveDisabled ? '' : 'Enregistrer'}
                                                  placement="bottom-start"
                                              >
                                                  <span>
                                                      <IconButton
                                                          disabled={saveDisabled}
                                                          onClick={() => void onSave()}
                                                          color="inherit"
                                                          size="small"
                                                      >
                                                          <SaveIcon />
                                                      </IconButton>
                                                  </span>
                                              </Tooltip>
                                          );
                                      })()
                                    : null}
                                {onDelete && !isNew ? (
                                    <Tooltip title={isSaving ? '' : 'Supprimer'} placement="bottom-start">
                                        <span>
                                            <IconButton
                                                disabled={isSaving}
                                                onClick={() => void onDelete()}
                                                color="inherit"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                ) : null}
                            </Stack>
                        ) : null}
                    </Stack>
                    {hasConflict ? (
                        <Alert severity="warning" sx={{ width: '100%', mt: 1 }}>
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
                    <Box sx={{ pt: 2 }}>{activeTab.content}</Box>
                </React.Fragment>
            ) : (
                children
            )}
            <DnDialog
                open={reloadDialogOpen}
                onClose={() => setReloadDialogOpen(false)}
                onConfirm={confirmReload}
                confirmLabel="Recharger"
                title="Recharger les données"
            >
                Attention, vos modifications locales seront perdues. Continuer ?
            </DnDialog>
        </View>
    );
}

const View = styled(Stack)(
    () => css`
        width: 100%;
        height: 100%;
        overflow-y: auto;
    `
);
