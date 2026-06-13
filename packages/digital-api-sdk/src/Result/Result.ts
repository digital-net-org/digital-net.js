import type { ResultMessage } from './ResultMessage';

export interface Result<T = null> {
    value: T;
    hasError: boolean;
    errors: ResultMessage[];
    infos: ResultMessage[];
}

export const defaultResult = {
    value: null,
    hasError: false,
    errors: [],
    infos: [],
} satisfies Result;
