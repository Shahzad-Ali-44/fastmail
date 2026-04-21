import Router from '@koa/router';
import * as UserController from '../../controllers/user.js';
import { authorizeUser } from '../../middlewares/auth.js';
import { authRoutes } from './auth.js';
import { userTempEmailRoutes } from './user-temp-email.js';

const router = new Router({ prefix: '/user' });

router.use(authRoutes);
router.use(userTempEmailRoutes);

router.get(
    '/',
    authorizeUser(),
    UserController.getProfile,
);

export const userRoutes = router.routes();