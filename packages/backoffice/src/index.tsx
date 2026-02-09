import '@digital-net-org/digital-ui';
import '@digital-net-org/digital-ui/styles';
import type from '@digital-net-org/digital-ui-react';

import { ReactApp } from './modules';

ReactApp.create({
    render: () => (
        <div>
            <dn-input-switch />
        </div>
    ),
});
