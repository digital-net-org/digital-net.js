import { expect, test } from 'vitest';
import { ClassName } from './ClassName';
import { excludedKeywords } from './keywords';

const base = 'Component';

test('ClassName.resolveProps(): With className, should return merged classNames', () => {
    expect(ClassName.resolveProps(base, { className: 'custom custom-stuff custom-thing' })).toBe(
        `${base} custom custom-stuff custom-thing`
    );
});

test('ClassName.resolveProps(): With aria property, should ignore property', () => {
    expect(ClassName.resolveProps(base, { 'aria-hidden': true })).toBe(base);
});

test('ClassName.resolveProps(): With data property, should ignore property', () => {
    expect(ClassName.resolveProps(base, { 'data-id': '1' })).toBe(base);
});

test('ClassName.resolveProps(): With event function property, should return "action" keyword', () => {
    expect(ClassName.resolveProps(base, { onClick: () => void 0 })).toBe(`${base} ${base}-action`);
});

test('ClassName.resolveProps(): With boolean property, should return "property" keyword', () => {
    expect(ClassName.resolveProps(base, { disabled: true })).toBe(`${base} ${base}-disabled`);
});

test('ClassName.resolveProps(): With falsy property, should ignore property', () => {
    expect(ClassName.resolveProps(base, { disabled: false })).toBe(base);
});

test('ClassName.resolveProps(): With string property, should return "property-value" keyword', () => {
    expect(ClassName.resolveProps(base, { variant: 'primary' })).toBe(`${base} ${base}-variant-primary`);
});

test('ClassName.resolveProps(): With number property, should return "property-value" keyword', () => {
    expect(ClassName.resolveProps(base, { size: 2 })).toBe(`${base} ${base}-size-2`);
});

test('ClassName.resolveProps(): With undefined property, should ignore property', () => {
    expect(ClassName.resolveProps(base, { size: undefined })).toBe(base);
});

test('ClassName.resolveProps(): With empty string property, should ignore property', () => {
    expect(ClassName.resolveProps(base, { variant: '' })).toBe(base);
});

test('ClassName.resolveProps(): With many properties, should return merged classNames', () => {
    expect(
        ClassName.resolveProps(base, {
            className: 'custom',
            loading: true,
            disabled: false,
            selected: true,
            fullwidth: false,
            onClick: () => void 0,
        })
    ).toBe(`${base} custom ${base}-loading ${base}-selected ${base}-action`);
});

test('ClassName.resolveProps(): With excluded property, should ignore property', () => {
    for (const key of excludedKeywords) {
        expect(ClassName.resolveProps(base, { [key]: 'value' })).toBe(base);
    }
});
