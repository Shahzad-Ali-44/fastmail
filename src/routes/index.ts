import Router from '@koa/router';
import { tempEmailRoutes } from './temp-email/temp-email.js';
import { userRoutes } from './user/user.js';

const router = new Router({ prefix: '/api/v1' });

router.use(tempEmailRoutes);
router.use(userRoutes);

export const routes = router.routes();