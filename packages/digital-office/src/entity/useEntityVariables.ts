import * as React from 'react';
import type { TemplateVariable } from '@digital-net-org/digital-api-sdk';
import { type DnEntityVariableKey, useDnEntityVariablesContext } from './useDnEntityVariablesContext';

export interface UseEntityVariablesResult {
    variables: TemplateVariable[];
    loading: boolean;
}

export function useEntityVariables(key: DnEntityVariableKey | null | undefined): UseEntityVariablesResult {
    const { variables, errors, loadingKeys, loadVariables } = useDnEntityVariablesContext();

    React.useEffect(() => {
        if (key) loadVariables(key);
    }, [key, loadVariables]);

    if (key && errors[key]) throw errors[key];

    return {
        variables: key ? (variables[key] ?? []) : [],
        loading: !!key && (loadingKeys.has(key) || !(key in variables)),
    };
}
