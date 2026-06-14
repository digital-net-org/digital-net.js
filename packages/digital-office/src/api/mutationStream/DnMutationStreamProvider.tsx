import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MutationStreamClient } from '@digital-net-org/digital-api-sdk';
import { useDigitalNetApi } from '../DigitalNetApiProvider';
import { useDigitalNetUser } from '../../app';
import { resolveInvalidations, type InvalidationFilter } from './invalidationMap';
import type { MutationSignal } from '@digital-net-org/digital-api-sdk';

const FLUSH_DELAY_MS = 250;

export function DnMutationStreamProvider({ children }: { children: React.ReactNode }) {
    const api = useDigitalNetApi();
    const queryClient = useQueryClient();
    const { user } = useDigitalNetUser();
    const userId = user?.id;

    // Latest user id, kept available to the stable signal handler (never read/written during render).
    const userIdRef = React.useRef<string | undefined>(undefined);
    React.useEffect(() => void (userIdRef.current = userId));

    const pendingRef = React.useRef(new Map<string, InvalidationFilter>());
    const flushTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const flush = React.useCallback(() => {
        flushTimerRef.current = null;
        const filters = [...pendingRef.current.values()];
        pendingRef.current.clear();
        for (const filter of filters) {
            void queryClient.invalidateQueries(filter);
        }
    }, [queryClient]);

    const handleSignal = React.useCallback(
        (signal: MutationSignal) => {
            if (signal.isSelf) return;
            for (const filter of resolveInvalidations(signal, userIdRef.current)) {
                const key = filter.queryKey ? JSON.stringify(filter.queryKey) : `predicate:${signal.entity}`;
                pendingRef.current.set(key, filter);
            }
            flushTimerRef.current ??= setTimeout(flush, FLUSH_DELAY_MS);
        },
        [flush]
    );

    React.useEffect(() => {
        // Server resolves `isSelf` from the refresh cookie, whose identity (userId) is stable across token
        // rotations. Mutation Stream is not needed on public views.
        if (userId == null) return;
        if (!api.http.getApplicationKey()) {
            console.error(
                '[digital-office] mutation stream disabled: a mandatory application key is missing from the HttpClient config.'
            );
            return;
        }
        const client = new MutationStreamClient(api.http);
        const stop = client.connect({
            onSignal: handleSignal,
            onError: (error, attempt) => {
                if (attempt >= 3) {
                    console.warn(`[digital-office] mutation stream reconnect failing (attempt ${attempt})`, error);
                }
            },
        });

        return () => {
            stop();
            if (flushTimerRef.current) {
                clearTimeout(flushTimerRef.current);
                flushTimerRef.current = null;
            }
        };
    }, [api, handleSignal, userId]);

    return <React.Fragment>{children}</React.Fragment>;
}
