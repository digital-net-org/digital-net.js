import '@digital-net-org/digital-ui';
import '@digital-net-org/digital-ui/styles';

import { ReactApp } from './modules';

ReactApp.create({
    render: () => (
        <div>
            <dn-input-switch onChange={e => console.log(e.currentTarget.value)} />
        </div>
    ),
});
