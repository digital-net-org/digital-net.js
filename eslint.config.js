import rules from './eslint/eslint-rules-js.js';

/** @type {import('eslint').Linter.Config[]} */
const config = [
    {
        rules,
        ignores: ['**/dist/**', '**/node_modules/**'],
    },
];

export default config;
