import { useLocalStorage } from '@digital-lib/core';

export function useJwt() {
    return useLocalStorage<string | undefined>(STORAGE_KEY_AUTH);
}
