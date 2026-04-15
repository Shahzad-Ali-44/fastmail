import Joi from 'joi';
import type { ISMiddleware } from '../interfaces/koa.js';
import { validateObject } from '../utils/joi-util.js';

export const offsetLimitMiddleware: ISMiddleware = async (ctx, next) => {
    const query = {
        offset: ctx.request.query.offset,
        limit: ctx.request.query.limit,
    };

    ctx.state.pagination = validateObject(query, {
        offset: Joi.number().integer().default(0),
        limit: Joi.number().integer().max(5000).default(5000),
    });

    await next();
};
