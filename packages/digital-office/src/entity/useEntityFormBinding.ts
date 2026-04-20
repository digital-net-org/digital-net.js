import React from 'react';
import { EntityFormContext, type EntityFormBinding } from './EntityFormContext';

export function useEntityFormBinding<T>(): EntityFormBinding<T> {
    return React.useContext(EntityFormContext) as EntityFormBinding<T>;
}
