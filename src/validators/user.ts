import Boom from '@hapi/boom';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import type { ISMiddleware } from '../interfaces/koa.js';
import { UserModel } from '../models/classes/user-model.js';
import { EmailSchema, validateObject } from '../utils/joi-util.js';

const userModel = new UserModel();

export const register: ISMiddleware = async (ctx, next) => {
    const body = validateObject(ctx.request.body, {
        firstName: Joi.string().max(150).required(),
        lastName: Joi.string().max(150).required(),
        email: EmailSchema.required(),
        password: Joi.string().min(6).max(100).required(),
    });

    const existing = await userModel.getByEmail(body.email);
    if (existing) {
        throw Boom.conflict('Email is already registered');
    }

    ctx.state.body = body;
    await next();
};

export const login: ISMiddleware = async (ctx, next) => {
    const body = validateObject(ctx.request.body, {
        email: EmailSchema.required(),
        password: Joi.string().min(1).max(100).required(),
    });

    const user = await userModel.getByEmail(body.email);
    if (!user) {
        throw Boom.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
        throw Boom.forbidden('Your account has been disabled');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
        throw Boom.unauthorized('Invalid password');
    }

    ctx.state.body = body;
    ctx.state.siUser = user;
    await next();
};

