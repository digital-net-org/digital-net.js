import * as React from 'react';
import { useParams } from 'react-router';
import { CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import { DnDialog, DnDialogConfirmPassword, DnIconButton, DnView } from '../ui';
import { useRouterBlocker } from '../navigation';
import { useUserData } from './useUserData';
import { UserIdentityTab } from './Tabs';

export function UserEditView() {
    const { id } = useParams<{ id: string }>();
    const { readOnlyData, formState, setFormState, isSaving, isLoading, isDirty, save, requestDelete, passwordDialog } =
        useUserData(id);
    const blocker = useRouterBlocker({ when: isDirty && !isSaving });

    return (
        <React.Fragment>
            <DnView
                title="Paramétrage"
                isDirty={isDirty}
                renderActions={
                    <React.Fragment>
                        {isSaving ? <CircularProgress size={20} /> : null}
                        <DnIconButton tooltip="Enregistrer" disabled={!isDirty || isSaving} onClick={() => void save()}>
                            <SaveIcon />
                        </DnIconButton>
                        <DnIconButton tooltip="Supprimer" disabled={isSaving} onClick={() => requestDelete()}>
                            <DeleteIcon />
                        </DnIconButton>
                    </React.Fragment>
                }
                tabs={[
                    {
                        key: 'identity',
                        label: 'Identité',
                        content: (
                            <UserIdentityTab
                                readOnlyData={readOnlyData}
                                formState={formState}
                                setFormState={setFormState}
                                disabled={isSaving || isLoading}
                            />
                        ),
                    },
                ]}
            />
            <DnDialog
                open={blocker.isBlocked}
                title="Modifications non sauvegardées"
                confirmLabel="Quitter sans sauvegarder"
                onClose={blocker.cancel}
                onConfirm={blocker.confirm}
            >
                Si vous quittez cette page, les données saisies seront perdues. Continuer ?
            </DnDialog>
            <DnDialogConfirmPassword {...passwordDialog} />
        </React.Fragment>
    );
}
