import type { ResultMessage } from './ResultMessage';

export interface QueryResult<T> {
    value: T[];
    index: number;
    size: number;
    total: number;
    pages: number;
    count: number;
    end: boolean;
    errors: ResultMessage[];
    infos: ResultMessage[];
}
