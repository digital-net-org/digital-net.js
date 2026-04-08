import { describe, it, expect, vi } from 'vitest';
import { DigitalEvent } from './DigitalEvent.js';

describe('DigitalEvent', () => {
    describe('subscribe()', () => {
        it('should register a listener and call it on emit with the payload', () => {
            const event = new DigitalEvent();
            const listener = vi.fn();

            event.subscribe(listener);
            event.emit('hello');

            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith('hello');
        });

        it('should call every subscribed listener in insertion order', () => {
            const event = new DigitalEvent();
            const calls = [];
            event.subscribe(() => calls.push('a'));
            event.subscribe(() => calls.push('b'));
            event.subscribe(() => calls.push('c'));

            event.emit(null);

            expect(calls).toEqual(['a', 'b', 'c']);
        });

        it('should return an unsubscribe function that removes the listener', () => {
            const event = new DigitalEvent();
            const listener = vi.fn();

            const unsubscribe = event.subscribe(listener);
            unsubscribe();
            event.emit('payload');

            expect(listener).not.toHaveBeenCalled();
        });

        it('should support generic payload types (object, string, undefined)', () => {
            /** @type {DigitalEvent<{ id: number }>} */
            const objectEvent = new DigitalEvent();
            const objectListener = vi.fn();
            objectEvent.subscribe(objectListener);
            objectEvent.emit({ id: 42 });
            expect(objectListener).toHaveBeenCalledWith({ id: 42 });

            /** @type {DigitalEvent<undefined>} */
            const voidEvent = new DigitalEvent();
            const voidListener = vi.fn();
            voidEvent.subscribe(voidListener);
            voidEvent.emit(undefined);
            expect(voidListener).toHaveBeenCalledWith(undefined);
        });
    });

    describe('emit()', () => {
        it('should not throw when called without any subscriber', () => {
            const event = new DigitalEvent();
            expect(() => event.emit('noop')).not.toThrow();
        });

        it('should call listeners with undefined when emit() is invoked without an argument', () => {
            /** @type {DigitalEvent<void>} */
            const voidEvent = new DigitalEvent();
            const listener = vi.fn();
            voidEvent.subscribe(listener);

            voidEvent.emit();

            expect(listener).toHaveBeenCalledTimes(1);
            expect(listener).toHaveBeenCalledWith(undefined);
        });
    });

    describe('clear()', () => {
        it('should remove every registered listener', () => {
            const event = new DigitalEvent();
            const listenerA = vi.fn();
            const listenerB = vi.fn();
            event.subscribe(listenerA);
            event.subscribe(listenerB);

            event.clear();
            event.emit('after-clear');

            expect(listenerA).not.toHaveBeenCalled();
            expect(listenerB).not.toHaveBeenCalled();
        });
    });

    describe('size', () => {
        it('should reflect the number of currently registered listeners', () => {
            const event = new DigitalEvent();
            expect(event.size).toBe(0);

            const unsubscribeA = event.subscribe(() => {});
            event.subscribe(() => {});
            expect(event.size).toBe(2);

            unsubscribeA();
            expect(event.size).toBe(1);

            event.clear();
            expect(event.size).toBe(0);
        });
    });
});
