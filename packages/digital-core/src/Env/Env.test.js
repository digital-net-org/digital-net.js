import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Env } from './Env.js';

describe('Async.delay', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should resolve after the specified delay', async () => {
        const spy = vi.fn();
        const delay = 1000;

        Env.delay(delay).then(spy);
        vi.advanceTimersByTime(delay);
        await vi.runAllTicks();

        expect(spy).toHaveBeenCalled();
    });
});
