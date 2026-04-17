import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import type { PageDto } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../api';
import { NotFoundView } from '../app';
import { DnView } from '../views';

export function PageEditView() {
    const { id } = useParams<{ id: string }>();
    const api = useDnApi();

    const { data, isLoading, isError } = useQuery<PageDto>({
        queryKey: ['cms-page', id],
        queryFn: async () => {
            const result = await api.http.request<PageDto>({
                path: 'cms/pages/:id',
                slugs: { id: id! },
            });
            return result.data;
        },
        enabled: Boolean(id),
        retry: false,
    });

    if (isLoading) return null;
    if (isError || !data) return <NotFoundView />;

    return (
        <DnView title={`Édition : ${data.path}`} description="Édition de page (placeholder).">
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </DnView>
    );
}
