export type MutationChangeType = 'Created' | 'Updated' | 'Deleted';

export interface MutationSignal {
    type: MutationChangeType;
    entity: string;
    entityId: string;
    originClientId?: string;
}

export type MutationStreamState = 'connecting' | 'open' | 'reconnecting' | 'closed';

export interface MutationStreamConnectOptions {
    onSignal: (_signal: MutationSignal) => void;
    onStateChange?: (_state: MutationStreamState) => void;
    onError?: (_error: unknown, _attempt: number) => void;
}
