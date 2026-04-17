import { useNavigate } from 'react-router';
import type { UserDto } from '@digital-net-org/digital-api-sdk';
import { DnEntityListView, type DnEntityListViewProps } from '../components';

const staticProps: DnEntityListViewProps<UserDto> = {
    title: 'Gestion des utilisateurs du back-office.',
    description: 'Créez, modifiez ou supprimez des utilisateurs et gérez leurs accès.',
    identifier: { singular: 'utilisateur', plural: 'utilisateurs', gender: 'm' },
    identifierAccessor: 'username',
    columns: ['username', 'email', 'isActive', 'isAdmin'],
    schemaPath: 'user',
    listPath: 'admin/user',
    deletePath: 'admin/user/:id',
};

export function UserListView() {
    const navigate = useNavigate();
    return (
        <DnEntityListView<UserDto>
            {...staticProps}
            onRowClick={row => navigate(`/admin/user/${row.id}`)}
            protectedDelete
        />
    );
}
