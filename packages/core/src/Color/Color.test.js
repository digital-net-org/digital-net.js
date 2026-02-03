import { describe, it, expect } from 'vitest';
import { Color } from './Color.js';

describe('Color.getRandomColor', () => {
    it('should return a hex color by default', () => {
        expect(Color.getRandomColor()).toMatch(/^#[0-9a-fA-F]+$/);
    });

    it('should return a valid RGB string when requested', () => {
        expect(Color.getRandomColor('RGB')).toMatch(/^rgb\(\d{1,3}, \d{1,3}\)$/);
    });

    it('should throw an error for unsupported formats', () => {
        expect(() => Color.getRandomColor('HSL')).toThrow();
    });
});
