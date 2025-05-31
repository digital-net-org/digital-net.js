import { expect, test } from 'vitest';
import { ResultBuilder } from './ResultBuilder';

test('ResultBuilder: isResult(), Should return false for non-Result input', () =>
    [
        null,
        undefined,
        8,
        'lol',
        () => void 0,
        true,
        [],
        {},
        { errors: [] },
        { infos: [] },
        { errors: 5, infos: [] },
        { errors: [], infos: 'mdr' },
    ].forEach(e => expect(ResultBuilder.isResult(e)).toBeFalsy()));

test('ResultBuilder: isResult(), Should return true for Result-like input', () =>
    expect(ResultBuilder.isResult({ errors: [], infos: [] })).toBeTruthy());

test('ResultBuilder: buildError(), Should create an error Result from non-Result input', () => {
    const input = { foo: 'bar' };
    const result = ResultBuilder.buildError(input);

    expect(result.value).toEqual(input);
    expect(result.hasError).toBeTruthy();
    expect(result.errors).toEqual([
        {
            code: '0',
            reference: 'INVALID_RESULT',
            message: 'Invalid result, error could not be interpreted',
        },
    ]);
    expect(result.infos).toEqual([]);
});

test('ResultBuilder: buildError(), Should preserve errors and infos from Result-like input', () => {
    const input = {
        value: null,
        errors: [
            {
                code: '0x80131577',
                reference: 'SYSTEM_COLLECTIONS_GENERIC_KEYNOTFOUNDEXCEPTION',
                message: 'Entity not found.',
                stackTrace: null,
            },
        ],
        infos: [
            {
                code: 'INFO',
                message: 'Additional information',
            },
        ],
    };
    const result = ResultBuilder.buildError(input);
    expect(result.value).toEqual(input);
    expect(result.hasError).toBeTruthy();
    expect(result.errors).toEqual(input.errors);
    expect(result.infos).toEqual(input.infos);
});
