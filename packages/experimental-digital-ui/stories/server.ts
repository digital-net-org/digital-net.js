import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const devRoot = path.resolve(__dirname);

(async () => {
    const app = express();

    const vite = await createServer({
        server: {
            middlewareMode: true,
            fs: { allow: [projectRoot] },
        },
        appType: 'custom',
        root: devRoot,
    });

    // Provide access to assets (ts, css files) to Vite
    app.use(vite.middlewares);
    app.use(async (req, res, next) => {
        const url = req.originalUrl;
        if (req.method !== 'GET') {
            return next();
        }

        try {
            let template = fs.readFileSync(path.resolve(devRoot, 'index.html'), 'utf-8');
            template = await vite.transformIndexHtml(url, template);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (e) {
            vite.ssrFixStacktrace(e as Error);
            next(e);
        }
    });

    console.log('Digital Stories is running!');
    console.log('Dev server: http://localhost:5173');
    app.listen(5173);
})();
