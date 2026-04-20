import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { useEntityFormBinding } from '../../entity';
import { DnInput } from '../../ui';

export function PageEditTabJsonLd() {
    const { values, setField, disabled } = useEntityFormBinding<PageDto>();
    return (
        <DnInput
            label="JSON-LD"
            value={values.jsonLd ?? ''}
            onChange={event => setField('/jsonLd', event.target.value)}
            disabled={disabled}
            fullWidth
            multiline
            rows={16}
            sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
        />
    );
}
