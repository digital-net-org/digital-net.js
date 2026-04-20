import React from 'react';

export interface DnEntityFormBinding<T> {
    values: Partial<T>;
    setField: (_path: string, _value: unknown) => void;
    isDirty: boolean;
    /** Accessors (camelCase field keys) currently flagged as errored. */
    errors?: ReadonlySet<string>;
    /** When true, all inputs in the form should render as disabled (save/delete/refetch in flight). */
    disabled?: boolean;
}

const DnEntityFormContext = React.createContext<DnEntityFormBinding<unknown> | null>(null);

export interface DnEntityFormProviderProps<T> {
    binding: DnEntityFormBinding<T>;
    children: React.ReactNode;
}

export function DnEntityFormProvider<T>({ binding, children }: DnEntityFormProviderProps<T>) {
    return (
        <DnEntityFormContext.Provider value={binding as DnEntityFormBinding<unknown>}>
            {children}
        </DnEntityFormContext.Provider>
    );
}

export function useDnEntityFormContext<T>(): DnEntityFormBinding<T> {
    const context = React.useContext(DnEntityFormContext);
    if (!context) {
        throw new Error('useDnEntityFormContext must be used within a DnEntityFormProvider.');
    }
    return context as DnEntityFormBinding<T>;
}
