import type { ISMiddleware } from '../interfaces/koa.js';
import * as TempEmailService from '../services/temp-email.js';

export const getCurrentTempEmail: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await TempEmailService.getCurrentTempEmailForUser(ctx.state.siUser.id);
    ctx.state.message = 'Temp email fetched successfully';
    await next();
};

export const createNewTempEmail: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await TempEmailService.createNew(ctx.state.siUser.id);
    ctx.state.message = 'New Temp email created successfully';
    await next();
};

export const listInbox: ISMiddleware = async (ctx, next) => {
    const { limit, offset } = ctx.state.body as { limit: number; offset: number };
    ctx.state.data = await TempEmailService.listInbox(ctx.state.siUser.id, { limit, offset });
    ctx.state.message = 'Inbox fetched successfully';
    await next();
};

export const ingestInbound: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await TempEmailService.ingestSendgridInbound(ctx.state.body);
    ctx.state.message = 'Inbound message processed';
    await next();
};

