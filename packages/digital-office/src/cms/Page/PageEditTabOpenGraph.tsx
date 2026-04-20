import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext } from '../../entity';
import { DnInput } from '../../ui';

export function PageEditTabOpenGraph() {
    const { values, setField, disabled } = useDnEntityFormContext<PageDto>();
    return (
        <DnInput
            label="OpenGraph"
            value={values.openGraph ?? ''}
            onChange={event => setField('/openGraph', event.target.value)}
            disabled={disabled}
            fullWidth
            multiline
            rows={16}
            sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
        />
    );
}
