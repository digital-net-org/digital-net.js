import * as React from 'react';
import { VersionContext, type DnVersion } from './useVersion';

export function VersionProvider({ version, children }: { version?: DnVersion; children: React.ReactNode }) {
    return <VersionContext.Provider value={version}>{children}</VersionContext.Provider>;
}
