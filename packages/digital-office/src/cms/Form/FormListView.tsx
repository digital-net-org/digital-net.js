import { useNavigate } from 'react-router';
import type { FormDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityListView, type DnEntityListViewProps } from '../../entity';
import type { DnColumnDefinition } from '../../ui';

const staticProps: DnEntityListViewProps<FormDto> = {
    title: 'Formulaires',
    description: 'Gérez les formulaires du site et consultez les soumissions des visiteurs.',
    identifier: { singular: 'formulaire', plural: 'formulaires', gender: 'm' },
    identifierAccessor: 'name',
    entityName: 'form',
    listPath: 'cms/forms',
    deletePath: 'cms/forms/:id',
    draftStoreName: 'forms',
    filters: [
        { type: 'like', key: 'name', label: 'Nom', placeholder: 'rechercher…' },
        { type: 'boolean', key: 'published', label: 'Publiés uniquement' },
        { type: 'like', key: 'path', label: 'Chemin', placeholder: '/contact' },
    ],
};

const columns: DnColumnDefinition<FormDto>[] = [
    { key: 'name', label: 'Nom' },
    { key: 'published', label: 'Publié' },
    { key: 'path', label: 'Chemin' },
    { key: 'updatedAt', label: 'Modifié le' },
];

export function FormListView() {
    const navigate = useNavigate();
    return (
        <DnEntityListView
            {...staticProps}
            columns={columns}
            onRowClick={row => navigate(`/content-manager/forms/${row.id}`)}
            onCreate={() => navigate('new')}
        />
    );
}
