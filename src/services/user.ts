import Boom from '@hapi/boom';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/classes/user-model.js';
import type { IUserModel } from '../models/interfaces/user-model.js';
import * as JwtUtils from '../utils/jwt-utils.js';
import type { IRegisterBody, ILoginBody } from '../interfaces/user.js';

const userModel = new UserModel();

const generateToken = (): string => {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const register = async (body: IRegisterBody): Promise<{ user: Partial<IUserModel>; authorization: string }> => {
    const existing = await userModel.getByEmail(body.email);
    if (existing) {
        throw Boom.conflict('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const token = generateToken();

    const userId = await userModel.insert({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        token,
        isActive: true,
    });

    const authorization = JwtUtils.signToken({ userId, token });

    const user = await userModel.getByToken(token);

    return {
        user: user as IUserModel,
        authorization,
    };

};

export const login = async (body: ILoginBody): Promise<{ user: Partial<IUserModel>; authorization: string }> => {

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

    const authorization = JwtUtils.signToken({ userId: user.id, token: user.token });

    const { password, ...registeredUser } = user as IUserModel;

    return {
        user: registeredUser,
        authorization,
    };
};

export const getUserByToken = async (token: string): Promise<IUserModel | undefined> => {
    try {
        const payload = JwtUtils.verifyToken(token);
        if (!payload.token) {
            return undefined;
        }
        return await userModel.getByToken(payload.token);
    } catch {
        return undefined;
    }
};
