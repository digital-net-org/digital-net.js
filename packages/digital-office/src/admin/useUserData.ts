import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type UserDto } from '@digital-net-org/digital-api-sdk';
import { useDigitalNetApi } from '../api';
import { NotFoundException, useDigitalToast } from '../app';
import { DN_QUERY_KEY_GET, unwrapResult } from '../entity';

const API_PATH = '/admin/user/:id';

export function useUserData(id: string | undefined) {
    const api = useDigitalNetApi();
    const queryClient = useQueryClient();
    const { showToast } = useDigitalToast();

    const queryKey = React.useMemo(() => [DN_QUERY_KEY_GET, API_PATH, id], [id]);
    const { data, isLoading, error } = useQuery<UserDto | undefined>({
        queryKey,
        queryFn: async () => {
            const response = await api.http.request<unknown>({
                path: API_PATH,
                slugs: { id: id! },
            });
            const result = unwrapResult<UserDto>(response.data);
            if (!dataInit && result) {
                setFormState({ isAdmin: result.isAdmin, isActive: result.isActive });
                setDataInit(true);
            }
            return result;
        },
        enabled: Boolean(id),
        retry: false,
    });

    if (error || !Boolean(id)) {
        throw new NotFoundException(`Utilisateur introuvable (${API_PATH}, id=${id})`);
    }

    const [dataInit, setDataInit] = React.useState<boolean>(false);
    const [formState, setFormState] = React.useState({ isAdmin: false, isActive: false });
    const [isSaving, setIsSaving] = React.useState(false);

    const isDirty = React.useMemo(
        () => Boolean(data && (data.isAdmin !== formState.isAdmin || data.isActive !== formState.isActive)),
        [data, formState.isActive, formState.isAdmin]
    );

    const readOnlyData = React.useMemo(
        () => ({
            username: data?.username,
            login: data?.login,
            email: data?.email,
            createdAt: data?.createdAt,
            updatedAt: data?.updatedAt,
        }),
        [data]
    );

    const save = React.useCallback(async () => {
        if (!data || !id) return;
        setIsSaving(true);

        const promises: Promise<any>[] = [];
        if (data.isAdmin !== formState.isAdmin) {
            promises.push(api.catalog.admin.updateUserRole({ isAdmin: formState.isAdmin }, id));
        }
        if (data.isActive !== formState.isActive) {
            promises.push(api.catalog.admin.updateUserStatus({ isActive: formState.isActive }, id));
        }
        try {
            await Promise.all(promises);
            await queryClient.invalidateQueries({ queryKey });
        } catch {
            showToast('Une erreur est survenue lors de la sauvegarde des modifications.', 'error');
        }

        // TODO: handle 403 on status change => If admin cannot set inactive, should be toasted
        // TODO: handle password prompt on Admin status change, try to use existing logic
        setIsSaving(false);
    }, [api.catalog.admin, data, formState.isActive, formState.isAdmin, id, queryClient, queryKey, showToast]);

    return {
        readOnlyData,
        formState,
        setFormState,
        isSaving,
        isLoading,
        isDirty,
        save,
    };
}
