import Router from '@koa/router';
import { authorizeUser } from '../../middlewares/auth.js';
import * as UserTempEmailController from '../../controllers/user-temp-email.js';
import * as TempEmailValidator from '../../validators/temp-email.js';

const router = new Router({ prefix: '/temp-email' });

router.get(
    '/',
    authorizeUser(),
    UserTempEmailController.getUserTempEmail,
);

router.post(
    '/new',
    authorizeUser(),
    UserTempEmailController.createNewForUser,
);

router.get(
    '/inbox',
    authorizeUser(),
    TempEmailValidator.listInbox,
    UserTempEmailController.listUserInbox,
);

export const userTempEmailRoutes = router.routes();