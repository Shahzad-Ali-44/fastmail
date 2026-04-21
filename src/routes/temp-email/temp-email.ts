import Router from '@koa/router';
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
    async (ctx, next) => {
        console.log('[inbound] content-type:', ctx.request.headers['content-type']);
        console.log('[inbound] body:', JSON.stringify(ctx.request.body));
        await next();
    },
    TempEmailValidator.ingestInbound,
    TempEmailController.ingestInbound,
);

export const tempEmailRoutes = router.routes();
