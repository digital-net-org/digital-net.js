import { describe, it, expect } from 'vitest';
import { StringMatcher } from './StringMatcher.js';

describe('StringMatcher', () => {
    describe('isEmpty()', () => {
        it('should return true for null, undefined or empty strings', () => {
            expect(StringMatcher.isEmpty(undefined)).toBe(true);
            expect(StringMatcher.isEmpty(null)).toBe(true);
            expect(StringMatcher.isEmpty('')).toBe(true);
            expect(StringMatcher.isEmpty(' ')).toBe(false);
        });
    });

    describe('isEmptyOrWhitespace()', () => {
        it('should return true for strings with only spaces', () => {
            expect(StringMatcher.isEmptyOrWhitespace('   ')).toBe(true);
            expect(StringMatcher.isEmptyOrWhitespace('\t\n')).toBe(true);
        });
    });

    describe('isCamelCase()', () => {
        it('should validate camelCase strings', () => {
            expect(StringMatcher.isCamelCase('myVariable')).toBe(true);
            expect(StringMatcher.isCamelCase('myVariable123')).toBe(true);
            expect(StringMatcher.isCamelCase('MyVariable')).toBe(false);
            expect(StringMatcher.isCamelCase('my_variable')).toBe(false);
        });
    });

    describe('isPascalCase()', () => {
        it('should validate PascalCase strings', () => {
            expect(StringMatcher.isPascalCase('MyClass')).toBe(true);
            expect(StringMatcher.isPascalCase('MyClass123')).toBe(true);
            expect(StringMatcher.isPascalCase('myClass')).toBe(false);
        });
    });

    describe('isSnakeCase()', () => {
        it('should validate snake_case strings', () => {
            expect(StringMatcher.isSnakeCase('my_variable')).toBe(true);
            expect(StringMatcher.isSnakeCase('my_variable_123')).toBe(true);
            expect(StringMatcher.isSnakeCase('myVariable')).toBe(false);
            expect(StringMatcher.isSnakeCase('MY_VARIABLE')).toBe(false);
        });
    });

    describe('isUpperSnakeCase()', () => {
        it('should validate UPPER_SNAKE_CASE strings', () => {
            expect(StringMatcher.isUpperSnakeCase('MY_CONSTANT')).toBe(true);
            expect(StringMatcher.isUpperSnakeCase('MY_VARIABLE_123')).toBe(true);
            expect(StringMatcher.isUpperSnakeCase('my_variable')).toBe(false);
        });
    });
});
