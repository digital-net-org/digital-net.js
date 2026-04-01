import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'digital-office',
            fileName: 'index',
            formats: ['es'],
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                /^@mui\/.*/,
                /^@emotion\/.*/,
                /^@digital-net-org\/.*/,
            ],
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
