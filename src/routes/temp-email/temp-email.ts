import Router from '@koa/router';
import { koaBody } from 'koa-body';
import { validateSession } from '../../middlewares/session.js';
import * as TempEmailController from '../../controllers/temp-email.js';
import * as TempEmailValidator from '../../validators/temp-email.js';

const router = new Router({ prefix: '/temp-email' });

router.post('/session',
    TempEmailController.createSession,
);

router.get('/session',
    validateSession(),
    TempEmailController.getSession,
);

router.post('/session/refresh',
    validateSession(),
    TempEmailController.refreshAddress,
);

router.get('/inbox',
    validateSession(),
    TempEmailValidator.listInbox,
    TempEmailController.listInbox,
);

router.post('/inbound',
    koaBody({ multipart: true, urlencoded: true, json: false }),
    TempEmailValidator.ingestInbound,
    TempEmailController.ingestInbound,
);

export const tempEmailRoutes = router.routes();
