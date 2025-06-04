import { expect, test } from 'vitest';
import { Property } from './Property';

test('Property.toHtml(): with booleans should convert values to strings', () => {
    const props = { disabled: true, visible: false, id: 'button-1', includeStuff: true, className: 'lol' };
    const expected = {
        disabled: '',
        id: 'button-1',
        includestuff: '',
        className: 'lol',
    };
    expect(Property.toHtml(props)).toEqual(expected);
});
