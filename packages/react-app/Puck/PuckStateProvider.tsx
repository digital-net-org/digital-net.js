import React from 'react';
import { Puck } from '@measured/puck';
import { PuckContext } from './PuckProvider';

export function PuckStateProvider(props: Omit<React.ComponentProps<typeof Puck>, 'config'>) {
    const { config } = React.useContext(PuckContext);
    return <Puck {...props} config={config} />;
}
