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
    onSignal: (signal: MutationSignal) => void;
    onStateChange?: (state: MutationStreamState) => void;
}
