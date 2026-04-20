import Joi from 'joi';
import type { ISMiddleware } from '../interfaces/koa.js';
import { validateObject } from '../utils/joi-util.js';

export const listInbox: ISMiddleware = async (ctx, next) => {
    ctx.state.body = validateObject(ctx.request.query, {
        limit: Joi.number().integer().min(1).max(100).default(25),
        offset: Joi.number().integer().min(0).default(0),
    });
    await next();
};

export const ingestInbound: ISMiddleware = async (ctx, next) => {
    ctx.state.body = validateObject(ctx.request.body, {
        to: Joi.string().email({ tlds: { allow: false } }),

        from: Joi.string().email({ tlds: { allow: false } }),

        subject: Joi.string(),
        text: Joi.string(),
        html: Joi.string().optional(),
    });
    await next();
};

