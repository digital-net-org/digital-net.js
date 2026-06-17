import * as React from 'react';
import type { TemplateVariable } from '@digital-net-org/digital-api-sdk';

export type DnEntityVariableKey = 'page:article';

export interface DnEntityVariablesContextValue {
    variables: Partial<Record<DnEntityVariableKey, TemplateVariable[]>>;
    errors: Partial<Record<DnEntityVariableKey, Error>>;
    loadingKeys: ReadonlySet<DnEntityVariableKey>;
    loadVariables: (_key: DnEntityVariableKey) => void;
}

export const DnEntityVariablesContext = React.createContext<DnEntityVariablesContextValue | null>(null);

export function useDnEntityVariablesContext(): DnEntityVariablesContextValue {
    const context = React.useContext(DnEntityVariablesContext);
    if (!context) {
        throw new Error('useDnEntityVariablesContext must be used within a DnEntityVariablesProvider.');
    }
    return context;
}
