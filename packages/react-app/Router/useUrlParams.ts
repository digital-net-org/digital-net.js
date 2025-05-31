import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { ObjectMutator } from '../../core';

/**
 * Hook to manage URL parameters.
 * @returns A tuple with the current URL parameters and a function to update them.
 */
export function useUrlParams<T extends Record<string, any>>(): [T, (value: T | ((prev: T) => T)) => void] {
    const location = useLocation();
    const navigate = useNavigate();

    const params = React.useMemo(
        () => Object.fromEntries(new URLSearchParams(location.search).entries()) as T,
        [location.search]
    );

    const setParams = React.useCallback(
        (value: T | ((prev: T) => T)) => {
            const resolved = typeof value === 'function' ? value(params) : value;
            navigate({
                search: new URLSearchParams(ObjectMutator.deleteUndefinedEntries(resolved)).toString(),
            });
        },
        [navigate, params]
    );

    return [params, setParams];
}
