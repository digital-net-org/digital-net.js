import React from 'react';
import { Localization, useToaster } from '@digital-net/react-app';
import { Table } from '@digital-net/react-digital-ui';
import { usePuckConfig } from '../../../usePuckConfig';
import { usePuckConfigDelete } from './usePuckConfigDelete';
import { PuckConfigForm } from './PuckConfigForm';

export function PuckConfigView() {
    const { toast } = useToaster();

    const [open, setOpen] = React.useState(false);
    const { configs, isLoading } = usePuckConfig();
    const { deleteConfig, isDeleting } = usePuckConfigDelete({
        onSuccess: () => toast('settings:frame.actions.delete.success', 'success'),
        onError: ({ status }) => toast(`settings:frame.actions.delete.error.${status}`, 'error'),
    });

    return (
        <React.Fragment>
            <PuckConfigForm open={open} onClose={() => setOpen(false)} />
            <Table
                onCreate={() => setOpen(true)}
                onDelete={id => deleteConfig(id)}
                entities={configs}
                columns={['id', 'version', 'createdAt']}
                renderHeader={key =>
                    Localization.translate(`app-settings:pages.pages-puck.result.headers.${String(key)}`)
                }
                renderRow={(key, row) => {
                    if (key === 'version') {
                        return <React.Fragment>{row.version}</React.Fragment>;
                    }
                    if (key === 'createdAt') {
                        return <React.Fragment>{row.createdAt?.toLocaleString()}</React.Fragment>;
                    }
                }}
                loading={isLoading}
                loadingActions={isDeleting}
                renderEmpty={() => Localization.translate('app-settings:pages.pages-puck.result.empty')}
            />
        </React.Fragment>
    );
}
