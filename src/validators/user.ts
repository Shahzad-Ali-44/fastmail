import Joi from 'joi';
import type { ISMiddleware } from '../interfaces/koa.js';
import { EmailSchema, validateObject } from '../utils/joi-util.js';

export const register: ISMiddleware = async (ctx, next) => {
    ctx.state.body = validateObject(ctx.request.body, {
        firstName: Joi.string().max(150).required(),
        lastName: Joi.string().max(150).required(),
        email: EmailSchema.required(),
        password: Joi.string().min(6).max(100).required(),
    });
    await next();
};

export const login: ISMiddleware = async (ctx, next) => {
    ctx.state.body = validateObject(ctx.request.body, {
        email: EmailSchema.required(),
        password: Joi.string().min(1).max(100).required(),
    });
    await next();
};
