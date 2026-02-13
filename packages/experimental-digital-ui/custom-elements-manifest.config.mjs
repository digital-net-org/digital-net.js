export default {
    // See https://custom-elements-manifest.open-wc.org/analyzer/getting-started/ for more configuration options.
    globs: ['src/**/*.ts'],
    exclude: ['**/*.test.ts', '**/*.stories.ts'],
    litelement: true,
    packagejson: true,
    plugins: [
        {
            name: 'CustomElement-filter',
            analyzePhase({ moduleDoc }) {
                moduleDoc.declarations = moduleDoc.declarations?.filter(
                    declaration =>
                        (declaration?.superclass?.name === 'CustomElement' ||
                            declaration?.superclass?.name === 'CustomFormElement') &&
                        declaration?.name !== 'CustomFormElement'
                );
            },
        },
    ],
};
