import { useLocalStorage } from '@digital-net/core';

export function useJwt() {
    return useLocalStorage<string | undefined>(STORAGE_KEY_AUTH);
}
