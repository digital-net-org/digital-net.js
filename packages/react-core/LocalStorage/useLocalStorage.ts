import React from 'react';
import { LocalStorage } from '@digital-net/core';
import { useFirstRender } from '../Effect';

/**
 * Accessor to local storage. It will automatically update the state when the value changes.
 * @param key - local storage key
 * @param defaultValue - value to set if storage is empty
 * @returns state and setter
 * @example
 * ```tsx
 * import { useLocalStorage } from '@digital-net/react-core';
 * const [value, setValue] = useLocalStorage<string>('SOME_KEY', 'default value');
 * ```
 */
export function useLocalStorage<T>(key: string, defaultValue?: T) {
    const [state, setState] = React.useState<T | undefined | null>(LocalStorage.get<T>(key));

    useFirstRender(() => {
        const currentValue = LocalStorage.get<T>(key);
        if ((currentValue === null || currentValue === undefined) && defaultValue !== undefined) {
            LocalStorage.set(key, defaultValue);
            setState(defaultValue);
        } else {
            setState(currentValue);
        }
    });

    React.useEffect(() => {
        LocalStorage.onSet<T>(key, value => setState(value));
        LocalStorage.onRemove(key, () => setState(undefined));
        return () => LocalStorage.clearListeners(key);
    }, [key]);

    const handleSetState = (value?: T | undefined) => {
        if (value !== undefined) {
            return LocalStorage.set(key, value);
        }
        if (defaultValue !== undefined) {
            return LocalStorage.set(key, defaultValue);
        }
        return LocalStorage.remove(key);
    };

    return [state as T, handleSetState] as const;
}
