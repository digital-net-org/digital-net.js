/**
 * Default Digital-Net Prettier config
 * @example
 * import rules from '/path-to-package/prettier.js';
 * export default rules;
 * @type {Record<string, boolean | string | number>}
 * */
const config = {
    arrowParens: 'avoid',
    bracketSpacing: true,
    endOfLine: 'auto',
    jsxBracketSameLine: false,
    printWidth: 120,
    proseWrap: 'preserve',
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'es5',
    useTabs: false,
    requirePragma: false,
};

export default config;
