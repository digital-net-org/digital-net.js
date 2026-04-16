import { useParams } from 'react-router';

export function UserEditView() {
    const { id } = useParams<{ id: string }>();
    return <h1>Edit user {id}</h1>;
}
