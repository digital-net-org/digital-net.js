import * as React from 'react';
import type { DigitalApi } from '@digital-net-org/digital-api-sdk';

export const DigitalNetApiContext = React.createContext<DigitalApi | null>(null);

export function useDigitalNetApi(): DigitalApi {
    const context = React.useContext(DigitalNetApiContext);
    if (!context) {
        throw new Error('useDigitalNetApi must be used within a DigitalNetApiProvider.');
    }
    return context;
}
