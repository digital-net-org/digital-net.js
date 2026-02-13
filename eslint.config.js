import jsRules from './eslint/eslint-rules-js.js';
import tsRules from './eslint/eslint-rules-ts.js';
import { plugin as tsPlugin, parser as tsParser } from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
const config = [
    {
        rules: { ...jsRules },
        files: ['**/*.js'],
    },
    {
        plugins: { '@typescript-eslint': tsPlugin },
        languageOptions: { parser: tsParser },
        rules: { ...jsRules, ...tsRules },
        files: ['**/*.ts', '**/*.tsx'],
    },
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactPlugin.configs['jsx-runtime'].rules,
            ...reactHooksPlugin.configs.recommended.rules,
        },
    },
    {
        ignores: ['**/dist/**', '**/node_modules/**'],
    },
];

export default config;
