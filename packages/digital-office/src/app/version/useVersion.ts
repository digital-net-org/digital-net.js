import * as React from 'react';

export interface DnVersion {
    branch: string;
    tag: string;
    commit: string;
}

export const VersionContext = React.createContext<DnVersion | undefined>(undefined);

export function useVersion() {
    return React.useContext(VersionContext);
}
