import { describe, expect, it } from 'vitest';
import {
    BASE_RETRY_DELAY_MS,
    MAX_RETRY_DELAY_MS,
    STABLE_CONNECTION_MS,
    computeBackoffDelay,
    isConnectionStable,
} from './backoff';

describe('computeBackoffDelay', () => {
    it('grows the ceiling exponentially from the base delay (random = 1 → full ceiling)', () => {
        expect(computeBackoffDelay(1, () => 1)).toBe(BASE_RETRY_DELAY_MS); // 1000
        expect(computeBackoffDelay(2, () => 1)).toBe(BASE_RETRY_DELAY_MS * 2); // 2000
        expect(computeBackoffDelay(3, () => 1)).toBe(BASE_RETRY_DELAY_MS * 4); // 4000
        expect(computeBackoffDelay(4, () => 1)).toBe(BASE_RETRY_DELAY_MS * 8); // 8000
    });

    it('caps the ceiling at MAX_RETRY_DELAY_MS', () => {
        expect(computeBackoffDelay(99, () => 1)).toBe(MAX_RETRY_DELAY_MS);
        expect(computeBackoffDelay(99, () => 0)).toBe(MAX_RETRY_DELAY_MS / 2);
    });

    it('applies equal jitter: the result lies in [ceiling / 2, ceiling]', () => {
        // attempt 3 → ceiling 4000 → [2000, 4000]
        expect(computeBackoffDelay(3, () => 0)).toBe(2000);
        expect(computeBackoffDelay(3, () => 0.5)).toBe(3000);
        expect(computeBackoffDelay(3, () => 1)).toBe(4000);
    });

    it('decorrelates: different random draws give different delays within the same bounds', () => {
        const low = computeBackoffDelay(4, () => 0); // 4000
        const high = computeBackoffDelay(4, () => 1); // 8000
        expect(low).toBe(4000);
        expect(high).toBe(8000);
        expect(low).toBeLessThan(high);
    });

    it('clamps attempt <= 0 to the first attempt (never a zero/negative ceiling)', () => {
        expect(computeBackoffDelay(0, () => 1)).toBe(BASE_RETRY_DELAY_MS);
        expect(computeBackoffDelay(-5, () => 1)).toBe(BASE_RETRY_DELAY_MS);
    });

    it('defaults to Math.random and always stays within the attempt bounds', () => {
        for (let attempt = 1; attempt <= 8; attempt += 1) {
            const ceiling = Math.min(MAX_RETRY_DELAY_MS, BASE_RETRY_DELAY_MS * 2 ** (attempt - 1));
            for (let i = 0; i < 25; i += 1) {
                const delay = computeBackoffDelay(attempt);
                expect(delay).toBeGreaterThanOrEqual(ceiling / 2);
                expect(delay).toBeLessThanOrEqual(ceiling);
            }
        }
    });
});

describe('isConnectionStable', () => {
    const openedAt = 1_000_000;

    it('is false when the connection never opened (headers never received)', () => {
        expect(isConnectionStable(null, openedAt + STABLE_CONNECTION_MS)).toBe(false);
    });

    it('is false below the stability threshold (mere acceptance)', () => {
        expect(isConnectionStable(openedAt, openedAt)).toBe(false);
        expect(isConnectionStable(openedAt, openedAt + STABLE_CONNECTION_MS - 1)).toBe(false);
    });

    it('is true once open at least the stability threshold', () => {
        expect(isConnectionStable(openedAt, openedAt + STABLE_CONNECTION_MS)).toBe(true);
        expect(isConnectionStable(openedAt, openedAt + STABLE_CONNECTION_MS + 60_000)).toBe(true);
    });
});
