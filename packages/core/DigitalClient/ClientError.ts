import type { Result } from '@digital-net/core';

export const digitalApiErrors = {
    'Entity-validation-exception': '0x80131500',
};

export class ClientError {
    public static isErrorOfType(result: Result, match: keyof typeof digitalApiErrors) {
        return result.errors.find(e => e.code === digitalApiErrors[match]);
    }
}
