import type { Result } from './Result';
import type { ResultMessage } from './ResultMessage';

export class ResultBuilder {
    public static isResult(input: any) {
        if (typeof input !== 'object') {
            return false;
        }
        return Array.isArray(input?.errors) && Array.isArray(input?.infos);
    }

    public static buildError<T>(input: any): Result<T> {
        const isResult = this.isResult(input);
        return {
            value: input,
            hasError: true,
            errors: isResult
                ? input.errors
                : ([
                      {
                          code: '0',
                          reference: 'INVALID_RESULT',
                          message: 'Invalid result, error could not be interpreted',
                      },
                  ] satisfies Array<ResultMessage>),
            infos: isResult ? input.infos : [],
        };
    }
}
