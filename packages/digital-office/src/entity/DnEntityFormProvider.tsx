import React from 'react';

export interface DnEntityFormBinding<T> {
    values: Partial<T>;
    apiData?: Partial<T>;
    setField: (_path: string, _value: unknown) => void;
    isDirty: boolean;
    errors?: ReadonlySet<string>;
    disabled?: boolean;
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
