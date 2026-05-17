import * as React from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { MediaDto } from '@digital-net-org/digital-api-sdk';
import { DN_QUERY_KEY_LIST, DnEntityListView, type DnEntityListViewProps } from '../../entity';
import { type DnColumnDefinition, formatFileSize, formatDimensions } from '../../ui';
import { MediaImportDialog } from './MediaImportDialog';
import { MediaPreview } from './MediaPreview';

const staticProps: DnEntityListViewProps<MediaDto> = {
    title: 'Médias',
    description: 'Gérez les images uploadées dans le backoffice.',
    identifier: { singular: 'média', plural: 'médias', gender: 'm' },
    identifierAccessor: 'name',
    entityName: 'media',
    listPath: 'cms/media',
    deletePath: 'cms/media/:id',
    draftStoreName: 'media',
    filters: [
        { type: 'like', key: 'name', label: 'Nom', placeholder: 'logo, banner…' },
        { type: 'boolean', key: 'published', label: 'Publiés uniquement' },
    ],
};

export function MediaListView() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [importOpen, setImportOpen] = React.useState(false);

    const columns: DnColumnDefinition<MediaDto>[] = [
        {
            kind: 'computed',
            key: 'preview',
            label: 'Aperçu',
            compute: row => <MediaPreview variant="list" mediaId={row.id} alt={row.alt ?? ''} />,
        },
        { key: 'name', label: 'Nom' },
        { key: 'alt', label: 'Alt' },
        {
            kind: 'computed',
            key: 'dimensions',
            label: 'Dimensions',
            compute: row => formatDimensions(row.width, row.height),
        },
        {
            kind: 'computed',
            key: 'fileSize',
            label: 'Taille',
            compute: row => formatFileSize(row.fileSize),
        },
        { key: 'published', label: 'Publié' },
        { key: 'updatedAt', label: 'Modifié le' },
    ];

    return (
        <React.Fragment>
            <DnEntityListView
                {...staticProps}
                columns={columns}
                onRowClick={row => navigate(`/content-manager/media/${row.id}`)}
                onCreate={() => setImportOpen(true)}
            />
            <MediaImportDialog
                open={importOpen}
                onClose={() => setImportOpen(false)}
                onUploaded={() =>
                    queryClient.invalidateQueries({
                        queryKey: [DN_QUERY_KEY_LIST, staticProps.listPath],
                        refetchType: 'all',
                    })
                }
            />
        </React.Fragment>
    );
}
