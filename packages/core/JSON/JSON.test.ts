import { expect, test } from 'vitest';
import { safeParse } from './JSON';

test('JSON: safeParse(), Should parse JSON string', () => {
    const json = '{"name": "John"}';
    expect(safeParse(json)).toEqual({ name: 'John' });
});

test('JSON: safeParse(), Should return null for invalid JSON string', () => {
    const json = '{"name": "John"';
    expect(safeParse(json)).toBeNull();
});

test('JSON: safeParse(), Should invoke callback for invalid JSON string', () => {
    const json = '{"name": "John"';
    let str = '';
    let error = new Error();
    const callBack = (s: string, e: Error) => {
        str = s;
        error = e;
    };
    safeParse(json, callBack);
    expect(str).toBe(json);
    expect(error).toBeInstanceOf(Error);
});
