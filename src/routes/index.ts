import Router from '@koa/router';
import { userRoutes } from './user/user.js';
import { tempEmailRoutes } from './temp-email/temp-email.js';

const router = new Router({ prefix: '/api/v1' });

router.use(userRoutes);
router.use(tempEmailRoutes);

export const routes = router.routes();
