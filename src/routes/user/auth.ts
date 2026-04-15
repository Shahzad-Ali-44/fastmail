import Router from '@koa/router';
import * as UserController from '../../controllers/user.js';
import * as UserValidator from '../../validators/user.js';

const router = new Router({
    prefix: '/auth',
});

router.post('/register',
    UserValidator.register,
    UserController.register,
);

router.post('/login',
    UserValidator.login,
    UserController.login,
);

export const authRoutes = router.routes();
export const authAllowedMethods = router.allowedMethods();
