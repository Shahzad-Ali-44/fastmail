import type { ISMiddleware } from '../interfaces/koa.js';
import * as UserService from '../services/user.js';




export const register: ISMiddleware = async (ctx, next) => 
    {
    ctx.state.data = await UserService.register(ctx.state.body);
    ctx.state.message = 'Registration successful';
    await next();
};



export const login: ISMiddleware = async (ctx, next) => 
    {
    ctx.state.data = await UserService.login(ctx.state.siUser);
    ctx.state.message = 'Login successful';
    await next();
};



export const getProfile: ISMiddleware = async (ctx, next) =>
     {
        ctx.state.data = ctx.state.siUser;
        ctx.state.message = 'Profile fetched successfully';
        await next();
};
