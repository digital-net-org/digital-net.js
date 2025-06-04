import { type Result } from '../../Dto';

export interface RequestCallbacks<T = any> {
    onError?: (error: Result & { status: number }) => Promise<void> | void;
    onSuccess?: (data: T) => Promise<void> | void;
}
