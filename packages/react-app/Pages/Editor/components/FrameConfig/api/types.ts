import type { RequestCallbacks } from '@digital-net/react-digital-client';

export interface FrameConfigCallbacks {
    onError?: RequestCallbacks<any>['onError'];
    onSuccess?: () => void;
}
