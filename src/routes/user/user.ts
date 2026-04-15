import Router from '@koa/router';
import * as UserController from '../../controllers/user.js';
import { authorizeUser } from '../../middlewares/auth.js';
import { authAllowedMethods, authRoutes } from './auth.js';

const router = new Router({ prefix: '/user' });

router.use(authRoutes);
router.use(authAllowedMethods);

router.get('/',
    authorizeUser(),
    UserController.getProfile,
);

export const userRoutes = router.routes();
export const userAllowedMethods = router.allowedMethods();
