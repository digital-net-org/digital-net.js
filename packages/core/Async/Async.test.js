import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Async } from './Async.js';

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

        Async.delay(delay).then(spy);
        vi.advanceTimersByTime(delay);
        await vi.runAllTicks();

        expect(spy).toHaveBeenCalled();
    });
});
