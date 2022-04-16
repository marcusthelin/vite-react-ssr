import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
const express = require('express');
import { createServer as createViteServer } from 'vite';

async function createServer() {
    const app = express();

    // Create Vite server in middleware mode. This disables Vite's own HTML
    // serving logic and let the parent server take control.
    //
    // In middleware mode, if you want to use Vite's own HTML serving logic
    // use `'html'` as the `middlewareMode` (ref https://vitejs.dev/config/#server-middlewaremode)
    const vite = await createViteServer({
        server: { middlewareMode: 'ssr' },
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
    app.use('/assets', express.static(path.resolve(__dirname, '../dist/client/assets')));

    app.get('*', async (req: Request, res: Response, next: NextFunction) => {
        const url = req.originalUrl;

        try {
            // 1. Read index.html
            const templateFile =
                process.env.NODE_ENV === 'production'
                    ? path.resolve(__dirname, '../dist', 'client/index.html')
                    : path.resolve('index.html');

            let template = fs.readFileSync(templateFile, 'utf8');
            let render;
            if (process.env.NODE_ENV === 'production') {
                render = (await import('../dist/server/entry' as any)).render;
            } else {
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule('/src/server/entry.tsx')).render;
            }

            // 4. render the app HTML. This assumes entry-server.js's exported `render`
            //    function calls appropriate framework SSR APIs,
            //    e.g. ReactDOMServer.renderToString()
            const stream = await render();
            const splitted = template.split('<!--ssr-outlet-->');
            res.set('Content-Type', 'text/html; charset=utf-8');
            res.write(splitted[0]);
            stream.on('data', (data: Buffer) => {
                res.write(data.toString());
            });
            stream.on('end', () => {
                res.write(splitted[1]);
                res.end();
            });
            // const final = template.replace('<!--ssr-outlet-->', html);
            // res.set('Content-Type', 'text/html; charset=utf-8')
            // res.send(final);

            // 6. Send the rendered HTML back.
        } catch (e) {
            // If an error is caught, let Vite fix the stracktrace so it maps back to
            // your actual source code.
            // @ts-ignore
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });

    app.listen(3000, () => {
        console.log('Listening port 3000');
    });
}

createServer();
