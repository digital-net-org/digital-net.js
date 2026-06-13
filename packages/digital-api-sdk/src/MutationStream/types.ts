export type MutationChangeType = 'Created' | 'Updated' | 'Deleted';

/** One entity mutation broadcast by the API (`event: mutation` SSE frames). */
export interface MutationSignal {
    type: MutationChangeType;
    entity: string;
    entityId: string;
    isSelf?: boolean;
}

export type MutationStreamState = 'connecting' | 'open' | 'closed';

export interface MutationStreamConnectOptions {
    onSignal: (_signal: MutationSignal) => void;
    onStateChange?: (_state: MutationStreamState) => void;
}
