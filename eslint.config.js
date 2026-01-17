import jsConfig from './eslint/eslint-rules-js.js';
import tsConfig from './eslint/eslint-rules-ts.js';

export default [
    {
        rules: {
            ...jsConfig,
            ...tsConfig,
        },
    },
    {
        ignores: [],
    },
];
