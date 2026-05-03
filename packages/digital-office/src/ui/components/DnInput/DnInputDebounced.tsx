import * as React from 'react';
import { DnInput, type DnInputProps } from './DnInput';

export interface DnInputDebouncedProps extends DnInputProps {
    onDebounced?: (_value: string, _signal: AbortSignal) => void | Promise<void>;
    debounceInMs?: number;
    /**
     * Optional predicate. When it returns `true` for the current value, the debounce timer,
     * the loader (`loadingNonBlocking`) and the `onDebounced` call are all short-circuited.
     * Use this to skip noop work when the value is e.g. equal to the pristine API value.
     */
    skipWhen?: (_value: string) => boolean;
}

const DEFAULT_DEBOUNCE_MS = 1500;

function pickValue(value: DnInputProps['value'], fallback: DnInputProps['defaultValue']): string {
    if (typeof value === 'string') return value;
    if (typeof fallback === 'string') return fallback;
    return '';
}

function shouldDebounce(candidate: string, regex: RegExp | undefined): boolean {
    if (candidate.length === 0) return false;
    return !(regex !== undefined && !regex.test(candidate));
}

export function DnInputDebounced({
    onDebounced,
    debounceInMs = DEFAULT_DEBOUNCE_MS,
    onChange,
    regex,
    skipWhen,
    loadingNonBlocking,
    ...rest
}: DnInputDebouncedProps) {
    const [isPending, setIsPending] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = React.useRef<AbortController | null>(null);

    // Stabilize `onDebounced` (parent usually passes a fresh arrow on each render) so
    // `runDebounce` stays referentially stable and the watch effect does not re-fire on each
    // parent render.
    const onDebouncedRef = React.useRef(onDebounced);
    React.useEffect(() => {
        onDebouncedRef.current = onDebounced;
    }, [onDebounced]);

    const cancelPending = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
    }, []);

    const runDebounce = React.useCallback(
        (next: string) => {
            timeoutRef.current = setTimeout(async () => {
                const controller = new AbortController();
                abortRef.current = controller;
                try {
                    await onDebouncedRef.current?.(next, controller.signal);
                } catch {
                    // Errors are the caller's responsibility — swallow here to keep the component stable.
                } finally {
                    if (!controller.signal.aborted) setIsPending(false);
                }
            }, debounceInMs);
        },
        [debounceInMs]
    );

    // Keep the predicate in a ref so we don't re-run the watch effect when the parent passes a
    // fresh arrow on each render.
    const skipWhenRef = React.useRef(skipWhen);
    React.useEffect(() => {
        skipWhenRef.current = skipWhen;
    }, [skipWhen]);

    // Track the last value we handled. Anything else showing up in `rest.value` is an external
    // change (hydration, programmatic reset) and triggers a debounce pass — but ONLY when the
    // new value passes `shouldDebounce` and is not skipped, so empty strings, regex-invalid
    // values or pristine values never fire.
    const lastHandledRef = React.useRef<string | undefined>(undefined);
    React.useEffect(() => {
        const current = pickValue(rest.value, rest.defaultValue);
        if (lastHandledRef.current === current) return;
        lastHandledRef.current = current;
        cancelPending();
        if (!onDebouncedRef.current || !shouldDebounce(current, regex) || skipWhenRef.current?.(current)) {
            setIsPending(false);
            return;
        }
        setIsPending(true);
        runDebounce(current);
    }, [rest.value, rest.defaultValue, regex, runDebounce, cancelPending]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const next = event.target.value;
        lastHandledRef.current = next;
        onChange?.(event);
        cancelPending();

        if (!onDebounced || !shouldDebounce(next, regex) || skipWhen?.(next)) {
            setIsPending(false);
            return;
        }

        setIsPending(true);
        runDebounce(next);
    };

    return (
        <DnInput
            {...rest}
            regex={regex}
            loadingNonBlocking={Boolean(loadingNonBlocking) || isPending}
            onChange={handleChange}
        />
    );
}
