import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { DnInput } from '../../ui';

export interface PageEditTabOpenGraphProps {
    page: PageDto | undefined;
}

export function PageEditTabOpenGraph({ page }: PageEditTabOpenGraphProps) {
    return (
        <DnInput
            label="OpenGraph"
            value={page?.openGraph ?? ''}
            disabled
            fullWidth
            multiline
            rows={16}
            sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
        />
    );
}
