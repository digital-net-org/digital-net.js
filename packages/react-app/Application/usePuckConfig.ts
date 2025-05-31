import React from 'react';
import { PuckConfigContext } from './AppSettings';

export function usePuckConfig() {
    return React.useContext(PuckConfigContext);
}
