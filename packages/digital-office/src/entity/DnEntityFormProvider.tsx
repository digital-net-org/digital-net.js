import React from 'react';

export interface DnEntityFormBinding<T> {
    values: Partial<T>;
    /** Pristine entity payload from the API. `undefined` in create mode or while loading. */
    apiData?: Partial<T>;
    setField: (_path: string, _value: unknown) => void;
    isDirty: boolean;
    errors?: ReadonlySet<string>;
    disabled?: boolean;
    /**
     * Counter incremented by the parent every time the user explicitly discards local edits
     * (e.g. clicks "Annuler les modifications locales"). Children that hold local UI state
     * derived from the API payload should re-init from `apiData` whenever this value changes,
     * even if the underlying query reference is unchanged (TanStack `structuralSharing` may
     * keep the same array reference when the content has not changed).
     */
    resetSignal?: number;
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
