import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    server: {
        open: '/dev/index.html',
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
    ],
});
