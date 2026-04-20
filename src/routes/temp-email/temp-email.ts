import Router from '@koa/router';
import { koaBody } from 'koa-body';
import { authorizeUser } from '../../middlewares/auth.js';
import * as TempEmailController from '../../controllers/temp-email.js';
import * as TempEmailValidator from '../../validators/temp-email.js';

const router = new Router({ prefix: '/temp-email' });

router.get('/',
    authorizeUser(),
    TempEmailController.getCurrentTempEmail,
);

router.post('/new',
    authorizeUser(),
    TempEmailController.createNewTempEmail,
);

router.get('/inbox',
    authorizeUser(),
    TempEmailValidator.listInbox,
    TempEmailController.listInbox,
);

router.post('/inbound',
    koaBody({ multipart: true, urlencoded: true, json: false }),
    TempEmailValidator.ingestInbound,
    TempEmailController.ingestInbound,
);

export const tempEmailRoutes = router.routes();

