import 'dotenv/config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { errorMiddleware } from './middlewares/error.js';
import { responseMiddleware } from './middlewares/response.js';
import { allowedMethods, routes } from './routes/index.js';

const app = new Koa();

app.use(errorMiddleware);
app.use(bodyParser());
app.use(routes);
app.use(allowedMethods);
app.use(responseMiddleware);

app.on('error', (err: Error) => {
    console.error('App error:', err.message);
});

export default app;
