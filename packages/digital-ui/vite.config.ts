import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    server: {
        open: '/stories/index.html',
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'digital-ui',
            fileName: 'index',
            formats: ['es'],
        },
        rollupOptions: {
            external: [/^lit/, /^@digital-net-org\/digital-core/],
        },
        emptyOutDir: true,
    },
    plugins: [
        dts({
            tsconfigPath: './tsconfig.build.json',
            outDir: 'dist',
        }),
        {
            name: 'copy-assets',
            writeBundle() {
                console.log('Copying assets');
                const tsConfigRaw = readFileSync(resolve(__dirname, 'tsconfig.build.json'), 'utf-8');
                const tsConfig = JSON.parse(tsConfigRaw.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ''));
                if (!tsConfig?.compilerOptions) {
                    throw new Error(
                        '[Build][copy-assets] Error: could not resolve compilerOptions in tsconfig.build.json'
                    );
                }
                const dest = resolve(__dirname, tsConfig?.compilerOptions?.outDir);
                if (!dest) {
                    throw new Error('[Build][copy-assets] Error: could not resolve outDir in tsconfig.build.json');
                }

                const cssSrc = resolve(__dirname, 'src/index.css');
                if (!existsSync(cssSrc)) {
                    throw new Error('[Build][copy-assets] Error: index.css not found in src/');
                }
                copyFileSync(cssSrc, resolve(dest, 'index.css'));
                console.log(`index.css copied to ${dest}`);

                const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
                if (!pkg.customElements) {
                    throw new Error('[Build][copy-assets] Error: customElements field not found in package.json');
                }
                const jsonSrc = resolve(__dirname, pkg.customElements);
                if (!existsSync(jsonSrc)) {
                    throw new Error(`[Build][copy-assets] Error: ${pkg.customElements} could not be found`);
                }
                copyFileSync(jsonSrc, resolve(dest, 'custom-elements.json'));
                console.log(`${pkg.customElements} copied to ${dest}`);
            },
        },
    ],
});
