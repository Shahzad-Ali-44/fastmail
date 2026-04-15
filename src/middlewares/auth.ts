import Joi from 'joi';
import { Key } from '../enums/key.js';
import type { ISMiddleware } from '../interfaces/koa.js';
import * as UserService from '../services/user.js';
import { unauthorizedWithKey } from '../utils/boom-util.js';
import { validateObject } from '../utils/joi-util.js';

export const authorizeUser = (): ISMiddleware => {

    return async (ctx, next) => {

        const authorizationWithBearer = validateObject(

            { ...ctx.request.headers, ...ctx.request.query },

            {
                authorization: Joi.string().max(1000),
            },

            { allowUnknown: true },

        ).authorization as string | undefined;



        if (!authorizationWithBearer) 
            {
            throw unauthorizedWithKey('Authorization is required', Key.unauthorized);
        }


        const parts = authorizationWithBearer.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') 
            {

            throw unauthorizedWithKey('Authorization is not valid', Key.unauthorized);
        }

        const token = parts[1];

        const user = await UserService.getUserByToken(token);

        if (!user) 
            {  
            throw unauthorizedWithKey('Session expired', Key.userLogout);
        }

        if (!user.isActive) 
            {
            throw unauthorizedWithKey('Your account has been disabled', Key.userLogout);
        }

        ctx.state.authorization = token;
        ctx.state.siUser = user;

        await next();
    };
};
