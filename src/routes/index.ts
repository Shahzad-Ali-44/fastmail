import Router from '@koa/router';
import { tempEmailRoutes } from './temp-email/temp-email.js';

const router = new Router({ prefix: '/api/v1' });

router.use(tempEmailRoutes);

export const routes = router.routes();
