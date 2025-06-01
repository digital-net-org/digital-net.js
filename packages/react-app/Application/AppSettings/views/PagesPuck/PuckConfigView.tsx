import React from 'react';
import { Table } from '@digital-net/react-digital-ui';
import { Localization } from '../../../../Localization';
import { usePuckConfig } from '../../../usePuckConfig';
import { PuckConfigForm } from './PuckConfigForm';
import { usePuckConfigApi } from './usePuckConfigApi';

export function PuckConfigView() {
    const [open, setOpen] = React.useState(false);
    const { configs, isLoading } = usePuckConfig();
    const { deleteConfig, isDeleting } = usePuckConfigApi();

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
