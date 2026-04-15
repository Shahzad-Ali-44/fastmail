import { Boom } from '@hapi/boom';
import type Joi from 'joi';
import type { Middleware } from '@koa/router';
import { Key } from '../enums/key.js';
import type { IMetaData } from '../interfaces/meta-data.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const errorMiddleware: Middleware = async (ctx, next) => {
    try {
        ctx.status = 200;
        await next();
    } catch (err: any) {
        let metaData: IMetaData;

        if (err.isJoi) {
            metaData = handleJoiError(err as Joi.ValidationError);
        } else if (err.isBoom) {
            metaData = handleBoomError(err as Boom);
        } else {
            metaData = handleDefaultError(err);
        }

        if (!IS_PRODUCTION) {
            metaData.stack = err.stack;
        }

        ctx.status = +metaData.status;
        ctx.body = { metaData };

        if (ctx.status === 500) {
            ctx.app.emit('error', err, ctx);
        }
    }
};

const handleJoiError = (err: Joi.ValidationError): IMetaData => {
    return {
        status: 400,
        message: err.details[0].message,
        key: err.details[0]?.type || Key.joi,
    };
};

const handleBoomError = (err: Boom): IMetaData => {
    return {
        status: +err.output.statusCode,
        message: err.message,
        key: (err.data as string) || Key.none,
    };
};

const handleDefaultError = (err: any): IMetaData => {
    let status = +err.status || 500;
    if (status < 100 || status >= 600) {
        status = 500;
    }
    return {
        status,
        message: err.message || 'Internal server error',
        key: Key.serverError,
    };
};
