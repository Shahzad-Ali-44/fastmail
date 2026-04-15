import Router from '@koa/router';
import { userAllowedMethods, userRoutes } from './user/user.js';

const router = new Router({ prefix: '/api/v1' });

router.get('/', (ctx) => {
    ctx.body = { message: 'Koa JS API server is running' };
});

router.use(userRoutes);
router.use(userAllowedMethods);

export const routes = router.routes();
export const allowedMethods = router.allowedMethods();