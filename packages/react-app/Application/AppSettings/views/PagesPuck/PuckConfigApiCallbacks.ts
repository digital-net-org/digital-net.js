import type { RequestCallbacks } from '@digital-net/react-digital-client';

export interface PuckConfigApiCallbacks {
    onError?: RequestCallbacks<any>['onError'];
    onSuccess?: () => void;
}
