import type { ISMiddleware } from '../interfaces/koa.js';
import * as TempEmailService from '../services/temp-email.js';

export const createSession: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await TempEmailService.createSession();
    ctx.state.message = 'Session created successfully';
    await next();
};

export const getSession: ISMiddleware = async (ctx, next) => {
    ctx.state.data = { token: ctx.state.session.token, address: ctx.state.session.address };
    ctx.state.message = 'Session fetched successfully';
    await next();
};

export const refreshAddress: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await TempEmailService.refreshAddress(ctx.state.session);
    ctx.state.message = 'Address refreshed successfully';
    await next();
};

export const listInbox: ISMiddleware = async (ctx, next) => {
    const { limit, offset } = ctx.state.body as { limit: number; offset: number };
    ctx.state.data = await TempEmailService.listInbox(ctx.state.session, { limit, offset });
    ctx.state.message = 'Inbox fetched successfully';
    await next();
};

export const ingestInbound: ISMiddleware = async (ctx, next) => {
    ctx.state.data = await TempEmailService.ingestSendgridInbound(ctx.state.body);
    ctx.state.message = 'Inbound message processed';
    await next();
};
