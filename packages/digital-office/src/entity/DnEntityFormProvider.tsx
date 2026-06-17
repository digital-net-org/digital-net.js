import React from 'react';
import { DnEntityFormContext, type DnEntityFormBinding } from './useDnEntityFormContext';

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
