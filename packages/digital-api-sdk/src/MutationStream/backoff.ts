export const BASE_RETRY_DELAY_MS = 1_000;
export const MAX_RETRY_DELAY_MS = 30_000;
export const STABLE_CONNECTION_MS = 5_000;

export function computeBackoffDelay(attempt: number, random: () => number = Math.random): number {
    const ceiling = Math.min(MAX_RETRY_DELAY_MS, BASE_RETRY_DELAY_MS * 2 ** (Math.max(1, attempt) - 1));
    const half = ceiling / 2;
    return half + random() * half;
}

export function isConnectionStable(
    openedAt: number | null,
    now: number,
    thresholdMs: number = STABLE_CONNECTION_MS
): boolean {
    return openedAt !== null && now - openedAt >= thresholdMs;
}
