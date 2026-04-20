import Boom from '@hapi/boom';
import type { ISMiddleware } from '../interfaces/koa.js';
import { SessionModel } from '../models/classes/session-model.js';

const sessionModel = new SessionModel();

export const validateSession = (): ISMiddleware => {
    return async (ctx, next) => {
        const token = ctx.request.headers['x-session-token'] as string | undefined;

        if (!token) {
            throw Boom.unauthorized('x-session-token header is required');
        }

        const session = await sessionModel.getByToken(token);

        if (!session) {
            throw Boom.unauthorized('Session not found');
        }

        ctx.state.session = session;

        await next();
    };
};
