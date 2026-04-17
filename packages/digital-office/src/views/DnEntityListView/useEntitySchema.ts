import { type SchemaProperty } from '@digital-net-org/digital-api-sdk';
import { useQuery } from '@tanstack/react-query';
import { useDnApi } from '../../api';

export function useEntitySchema(schemaPath: string): SchemaProperty[] {
    const api = useDnApi();
    const { data } = useQuery<SchemaProperty[]>({
        queryKey: ['dn-entity-schema', schemaPath],
        queryFn: async () => {
            const result = await api.catalog.getSchema(schemaPath);
            return result.hasError ? [] : result.value;
        },
    });
    return data ?? [];
}
