import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.d.ts'),
            name: 'digital-ui',
            fileName: 'index',
            formats: ['es'],
        },
        rollupOptions: {
            external: [/^lit/],
        },
    },
});
