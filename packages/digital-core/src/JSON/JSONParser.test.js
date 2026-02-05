import { describe, it, expect, vi } from 'vitest';
import { JSONParser } from './JSONParser.js';

describe('JSONParser.safeParse', () => {
    it('should parse a valid JSON string', () => {
        const json = '{"name": "John"}';
        expect(JSONParser.safeParse(json)).toEqual({ name: 'John' });
    });

    it('should return null for an invalid JSON string', () => {
        const json = '{"name": "John"';
        expect(JSONParser.safeParse(json)).toBeNull();
    });

    it('should invoke the callback when parsing fails', () => {
        const json = '{"name": "John"';
        const callBack = vi.fn();

        JSONParser.safeParse(json, callBack);
        expect(callBack).toHaveBeenCalledWith(json, expect.any(Error));
    });
});
