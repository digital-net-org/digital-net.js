import * as React from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { MediaDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityListView, type DnEntityListViewProps } from '../../entity';
import { buildListKey } from '../../api';
import { type DnColumnDefinition, formatFileSize, formatDimensions } from '../../ui';
import { MediaImportDialog } from './MediaImportDialog';
import { MediaPreview } from './MediaPreview';

const staticProps: DnEntityListViewProps<MediaDto> = {
    title: 'Médias',
    description: 'Gérez les images uploadées dans le backoffice.',
    identifier: { singular: 'média', plural: 'médias', gender: 'm' },
    identifierAccessor: 'name',
    entityName: 'media',
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
                    queryClient.invalidateQueries({ queryKey: buildListKey('media'), refetchType: 'all' })
                }
            />
        </React.Fragment>
    );
}
