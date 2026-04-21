import { Key } from '../enums/key.js';
import type { ISMiddleware } from '../interfaces/koa.js';
import * as UserService from '../services/user.js';
import * as JwtUtils from '../utils/jwt-utils.js';
import { unauthorizedWithKey } from '../utils/boom-util.js';

export const authorizeUser = (): ISMiddleware => {
    return async (ctx, next) => {
        const authorizationWithBearer = ctx.request.headers['authorization'] as string | undefined;

        if (!authorizationWithBearer) {
            throw unauthorizedWithKey('Authorization is required', Key.unauthorized);
        }

        const parts = authorizationWithBearer.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw unauthorizedWithKey('Authorization is not valid', Key.unauthorized);
        }

        let userToken: string;

        try {
            const payload = JwtUtils.verifyToken(parts[1]);

            if (!payload.token) {
                throw unauthorizedWithKey('Authorization is not valid', Key.unauthorized);
            }

            userToken = payload.token as string;
        } catch {
            throw unauthorizedWithKey('Session expired', Key.userLogout);
        }

        const user = await UserService.getUserByToken(userToken);

        if (!user) {
            throw unauthorizedWithKey('Session expired', Key.userLogout);
        }

        if (!user.isActive) {
            throw unauthorizedWithKey('Your account has been disabled', Key.userLogout);
        }

        ctx.state.siUser = user;

        await next();
    };
};