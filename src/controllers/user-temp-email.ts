import type { ISMiddleware } from '../interfaces/koa.js';
import * as TempEmailService from '../services/temp-email.js';

export const getUserTempEmail: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await TempEmailService.getUserTempEmail(ctx.state.siUser.id);
    ctx.state.message = 'Temp email fetched successfully';
    await next();
};

export const createNewForUser: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await TempEmailService.createNewForUser(ctx.state.siUser.id);
    ctx.state.message = 'New Temp email created successfully';
    await next();
};

export const listUserInbox: ISMiddleware = async (ctx, next) => {
    const { limit, offset } = ctx.state.body as { limit: number; offset: number };
    ctx.state.data = await TempEmailService.listUserInbox(ctx.state.siUser.id, { limit, offset });
    ctx.state.message = 'Inbox fetched successfully';
    await next();
};