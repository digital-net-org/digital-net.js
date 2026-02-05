import { defineConfig } from 'vite';
import { resolve } from 'path';

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
            external: [/^lit/],
        },
        emptyOutDir: true,
    },
});
