import Router from '@koa/router';
import { userRoutes } from './user/user.js';

const router = new Router({ prefix: '/api/v1' });

router.use(userRoutes);

export const routes = router.routes();
