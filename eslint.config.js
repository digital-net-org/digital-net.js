import rules from './eslint/eslint-rules-js.js';
import tsRules from './eslint/eslint-rules-ts.js';
import { plugin, parser } from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
const config = [
    {
        rules: { ...rules},
        files: ['**/*.js'],
    },
    {
        plugins: { '@typescript-eslint': plugin },
        languageOptions: { parser },
        rules: { ...rules, ...tsRules },
        files: ['**/*.ts', '**/*.tsx'],
    },
    {
        ignores: ['**/dist/**', '**/node_modules/**'],
    },
];

export default config;
