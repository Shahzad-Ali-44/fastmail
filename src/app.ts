import 'dotenv/config';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import { errorMiddleware } from './middlewares/error.js';
import { responseMiddleware } from './middlewares/response.js';
import { routes } from './routes/index.js';

const app = new Koa();

app.use(errorMiddleware);
app.use(koaBody({ multipart: true, urlencoded: true, json: true }));
app.use(async (ctx, next) => {
    if (ctx.path === '/') {
        ctx.body = { message: 'Koa JS API server is running' };
        return;
    }
    await next();
});
app.use(routes);
app.use(responseMiddleware);

app.on('error', (err: Error) => {
    console.error('App error:', err.message);
});

export default app;
