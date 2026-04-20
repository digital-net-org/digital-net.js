import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { DnInput } from '../../ui';

export interface PageEditTabJsonLdProps {
    page: PageDto | undefined;
}

export function PageEditTabJsonLd({ page }: PageEditTabJsonLdProps) {
    return (
        <DnInput
            label="JSON-LD"
            value={page?.jsonLd ?? ''}
            disabled
            fullWidth
            multiline
            rows={16}
            sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
        />
    );
}
