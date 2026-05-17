import * as React from 'react';
import type { JsonPatchOp, TagDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityEditView } from '../../entity';
import { useDnApi } from '../../api';
import { TagFormGeneral } from './TagFormGeneral';

export function TagEditView() {
    const api = useDnApi();

    const handleGet = React.useCallback((id: string) => api.catalog.tag.getById(id), [api.catalog.tag]);

    const handleDelete = React.useCallback((id: string) => api.catalog.tag.delete(id), [api.catalog.tag]);

    const handleUpdate = React.useCallback(
        (id: string, ops: JsonPatchOp[]) => api.catalog.tag.update(id, ops),
        [api.catalog.tag]
    );

    const handleCreate = React.useCallback(
        async (values: Partial<TagDto>) => {
            const created = await api.catalog.tag.create({
                name: String(values.name ?? ''),
                color: values.color ?? null,
            });
            return created;
        },
        [api.catalog.tag]
    );

    return (
        <DnEntityEditView
            entityName="tag"
            identifier={{ singular: 'tag', plural: 'tags', gender: 'm' }}
            identifierAccessor="name"
            draftStoreName="tags"
            listPath="cms/tags"
            redirectPath="/content-manager/tags"
            tabs={[
                {
                    key: 'general',
                    label: 'Général',
                    content: <TagFormGeneral />,
                },
            ]}
            onGet={handleGet}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onCreate={handleCreate}
        />
    );
}
