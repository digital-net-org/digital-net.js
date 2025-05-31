import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDelete, useGetById, usePatch, useSchema } from '../../../react-digital-client';
import type { Entity } from '@digital-net/core';
import { ObjectMatcher } from '@digital-net/core';

/* TODO: @horameus
    - PATCH: Handle schema for constraints
    - DELETE: Handle redirection
*/

/**
 * Hook to handle EntityForm actions.
 * @param endpoint The API endpoint.
 * @param redirect The redirect path after a deletion.
 */
export default function useEntityForm<T extends Entity>(endpoint: string, redirect: string) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [payload, setPayload] = React.useState<T>();
    const [isMutated, setIsMutated] = React.useState(false);

    const { entity, isQuerying } = useGetById<T>(endpoint, id);
    const { schema, isLoading: isSchemaLoading } = useSchema(endpoint);

    React.useEffect(() => (entity ? setPayload(entity) : void 0), [entity]);

    React.useEffect(() => {
        if (!ObjectMatcher.deepEquality(payload, entity)) {
            setIsMutated(true);
        } else {
            setIsMutated(false);
        }
    }, [payload, entity]);

    const isLoading = React.useMemo(() => isSchemaLoading || isQuerying, [isSchemaLoading, isQuerying]);

    const { patch, isPatching } = usePatch<T>(endpoint, {
        // onSuccess: async () => await invalidate(),
    });

    const { delete: _delete, isDeleting } = useDelete(endpoint, {
        // onSuccess: async () => await invalidate(),
    });

    const handlePatch = React.useCallback(async () => {
        if (!id || !payload || isLoading) {
            return;
        }
        patch(id, payload);
    }, [id, isLoading, patch, payload]);

    const handleDelete = React.useCallback(async () => {
        if (!id || isLoading) {
            return;
        }
        navigate(`/${redirect}`);
        _delete(id);
    }, [id, isLoading, _delete, navigate, redirect]);

    return {
        id,
        schema,
        isLoading,
        isPatching,
        isDeleting,
        isMutated,
        handlePatch,
        handleDelete,
        payload,
        setPayload,
    };
}
