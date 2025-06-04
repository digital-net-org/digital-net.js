import { safeParse } from '../JSON';

export class LocalStorage {
    public static get<T>(key: string): T | undefined {
        const item = localStorage.getItem(key);
        if (!item) {
            return undefined;
        }
        return (safeParse(item) ?? item) as T;
    }

    public static set<T>(key: string, value: T): void {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        window.dispatchEvent(new Event(`LS_SET_${key}`));
    }

    public static remove(key: string) {
        localStorage.removeItem(key);
        window.dispatchEvent(new Event(`LS_REMOVE_${key}`));
    }

    public static onSet<T>(key: string, callback: (value: T | undefined) => void) {
        window?.addEventListener?.(`LS_SET_${key}`, () => callback(LocalStorage.get<T>(key)));
    }

    public static onRemove(key: string, callback: () => void) {
        window?.addEventListener?.(`LS_REMOVE_${key}`, callback);
    }

    public static clearListeners(key: string) {
        window?.removeEventListener?.(`LS_SET_${key}`, () => void 0);
        window?.removeEventListener?.(`LS_REMOVE_${key}`, () => void 0);
    }
}
