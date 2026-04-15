import Boom from '@hapi/boom';
import { Key } from '../enums/key.js';
import type { ISMiddleware } from '../interfaces/koa.js';
import type { IResponse } from '../interfaces/response.js';

export const responseMiddleware: ISMiddleware = async (ctx, next) => {

    if (ctx.state.data === undefined) {
        throw Boom.notFound('Api Not Found');
    }

    const body: IResponse = {
        metaData: {
            status: ctx.status,
            message: ctx.state.message,
            key: Key.none,
        },
    };

    if (ctx.state.data !== null) {
        body.data = ctx.state.data;
    }
        
    
    ctx.body = body;
    ctx.status = body.metaData.status;
    await next();
};
