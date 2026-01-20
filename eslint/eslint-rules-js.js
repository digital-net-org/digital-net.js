/** @type {Record<string, any>} */
const rules = {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-empty-function': ['warn', { allow: [] }],
    'no-nested-ternary': 'error',
    'no-undef': 'off',
    'no-case-declarations': 'off',
};

export default rules;
