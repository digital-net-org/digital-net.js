import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'core',
            fileName: 'index',
            formats: ['es'],
        },
        emptyOutDir: true,
    },
    plugins: [
        dts({
            tsconfigPath: './tsconfig.json',
            entryRoot: 'src',
        }),
    ],
});
