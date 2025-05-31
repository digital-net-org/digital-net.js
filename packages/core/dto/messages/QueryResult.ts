import { type Result } from './Result';

export interface Pagination {
    count: number;
    end: boolean;
    index: number;
    pages: number;
    size: number;
    total: number;
}

export interface QueryResult<T> extends Result<Array<T>>, Pagination {}
