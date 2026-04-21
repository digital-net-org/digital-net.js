import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnEntityFormContext } from '../../entity';
import { DnCodeEditor } from '../../ui';

export function PageEditTabJsonLd() {
    const { values, setField, disabled } = useDnEntityFormContext<PageDto>();
    return (
        <DnCodeEditor
            value={values.jsonLd ?? ''}
            onChange={value => setField('/jsonLd', value)}
            language="json"
            // disabled={disabled}
        />
    );
}
