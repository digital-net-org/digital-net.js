import { StringResolver } from '@digital-net-org/digital-core';

export function formatEllipsis(value: string | null | undefined, maxLength: number, fallback = '—'): string {
    return StringResolver.truncateWithEllipsis(value ?? '', maxLength, fallback);
}
