import React from 'react';

export interface EntityFormBinding<T> {
    values: Partial<T>;
    setField: (_path: string, _value: unknown) => void;
    isDirty: boolean;
    /** Accessors (camelCase field keys) currently flagged as errored. */
    errors?: ReadonlySet<string>;
    /** When true, all inputs in the form should render as disabled (save/delete/refetch in flight). */
    disabled?: boolean;
}

const DEFAULT_BINDING: EntityFormBinding<unknown> = {
    values: {},
    setField: () => undefined,
    isDirty: false,
    disabled: false,
};

export const EntityFormContext = React.createContext<EntityFormBinding<unknown>>(DEFAULT_BINDING);

export interface EntityFormProviderProps<T> {
    binding: EntityFormBinding<T>;
    children: React.ReactNode;
}

export function EntityFormProvider<T>({ binding, children }: EntityFormProviderProps<T>) {
    return (
        <EntityFormContext.Provider value={binding as EntityFormBinding<unknown>}>
            {children}
        </EntityFormContext.Provider>
    );
}

/**
 * In-memory form state for create mode. No IDB persistence — values are lost
 * if the page unmounts. Pair with `useUnsavedChangesBlocker` to prompt the
 * user before navigating away.
 */
export function useEntityFormState<T extends object>(): EntityFormBinding<T> {
    const [values, setValues] = React.useState<Partial<T>>({});
    const [isDirty, setIsDirty] = React.useState(false);

    const setField = React.useCallback((path: string, value: unknown) => {
        if (!path.startsWith('/')) throw new Error(`useEntityFormState: path must start with '/', got "${path}"`);
        const key = path.slice(1).split('/')[0];
        setValues(prev => ({ ...prev, [key]: value }));
        setIsDirty(true);
    }, []);

    return { values, setField, isDirty };
}
