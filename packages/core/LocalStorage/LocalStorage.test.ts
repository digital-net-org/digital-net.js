import { afterEach, expect, test, vi } from 'vitest';
import { LocalStorage } from './LocalStorage';

const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

afterEach(() => {
    localStorage.clear();
    getItemSpy.mockClear();
    setItemSpy.mockClear();
});

test('LocalStorage.get(): Should return parsed value if key exist', () => {
    const value = { 1: 'test', 2: 1 };
    localStorage.setItem('key', JSON.stringify(value));
    expect(LocalStorage.get('key')).toStrictEqual(value);
    expect(getItemSpy).toHaveBeenCalledWith('key');
});

test('LocalStorage.set(): Should put parsed value as an object if key exist', () => {
    const value = { 1: 'test', 2: 1 };
    LocalStorage.set('key', value);
    expect(LocalStorage.get('key')).toStrictEqual(value);
    expect(getItemSpy).toHaveBeenCalledWith('key');
});
