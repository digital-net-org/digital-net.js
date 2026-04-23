import * as React from 'react';
import { DnInput, type DnInputProps } from './DnInput';

export interface DnInputDebouncedProps extends DnInputProps {
    onDebounced?: (_value: string, _signal: AbortSignal) => void | Promise<void>;
    debounceInMs?: number;
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
    loadingNonBlocking,
    ...rest
}: DnInputDebouncedProps) {
    const [isPending, setIsPending] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = React.useRef<AbortController | null>(null);

    // Stabilise `onDebounced` (parent usually passes a fresh arrow on each render) so
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

    // Track the last value we handled. Anything else showing up in `rest.value` is an external
    // change (hydration, programmatic reset) and triggers a debounce pass — but ONLY when the
    // new value passes `shouldDebounce`, so empty strings or regex-invalid values never fire.
    const lastHandledRef = React.useRef<string | undefined>(undefined);
    React.useEffect(() => {
        const current = pickValue(rest.value, rest.defaultValue);
        if (lastHandledRef.current === current) return;
        lastHandledRef.current = current;
        cancelPending();
        if (!onDebouncedRef.current || !shouldDebounce(current, regex)) {
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

        if (!onDebounced || !shouldDebounce(next, regex)) {
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
