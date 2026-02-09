import { defineConfig } from 'vite';
import { resolve } from 'path';
// @ts-expect-error - no types package..?
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
    define: {
        global: 'globalThis',
    },
    server: {
        port: 3009,
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                lib: resolve(__dirname, 'src/index.tsx'),
            },
            output: {
                compact: true,
                strict: true,
                format: 'esm',
                sourcemap: false,
                entryFileNames: '[hash].js',
                chunkFileNames: '[hash].js',
                assetFileNames: 'assets/[name][extname]',
            },
        },
    },
    plugins: [react(), checker({ typescript: true })],
});
