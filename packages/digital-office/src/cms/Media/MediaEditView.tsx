import * as React from 'react';
import type { JsonPatchOp } from '@digital-net-org/digital-api-sdk';
import { useDigitalNetApi } from '../../api';
import { DnEntityEditView } from '../../entity';
import { MediaTabGeneral, MediaTabVariants } from './Tabs';

export function MediaEditView() {
    const api = useDigitalNetApi();

    const handleGet = React.useCallback((id: string) => api.catalog.media.getById(id), [api.catalog.media]);

    const handleDelete = React.useCallback((id: string) => api.catalog.media.delete(id), [api.catalog.media]);

    const handleUpdate = React.useCallback(
        (id: string, ops: JsonPatchOp[]) => api.catalog.media.update(id, ops),
        [api.catalog.media]
    );

    return (
        <DnEntityEditView
            entityName="media"
            identifier={{ singular: 'média', plural: 'médias', gender: 'm' }}
            identifierAccessor="name"
            draftStoreName="media"
            listPath="cms/media"
            redirectPath="/content-manager/media"
            tabs={[
                {
                    key: 'general',
                    label: 'Général',
                    content: <MediaTabGeneral />,
                },
                {
                    key: 'variants',
                    label: 'Variants',
                    content: <MediaTabVariants />,
                },
            ]}
            onGet={handleGet}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
        />
    );
}
