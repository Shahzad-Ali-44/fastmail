import type { ISMiddleware } from '../interfaces/koa.js';
import * as UserService from '../services/user.js';

export const register: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await UserService.register(ctx.state.body);
    ctx.state.message = 'Registration successful';
    await next();
};

export const login: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await UserService.login(ctx.state.body);
    ctx.state.message = 'Login successful';
    await next();
};

export const getProfile: ISMiddleware = async (ctx, next) => {
    const user = ctx.state.siUser;
    ctx.state.data = user;
    ctx.state.message = 'Profile fetched successfully';
    await next();
};
