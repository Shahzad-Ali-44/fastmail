import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { UserModel } from '../models/classes/user-model.js';
import { SessionModel } from '../models/classes/session-model.js';
import type { IUserModel } from '../models/interfaces/user-model.js';
import type { IRegisterBody } from '../interfaces/user.js';
import * as JwtUtils from '../utils/jwt-utils.js';
import { generateTempEmailAddress } from '../utils/temp-email-utils.js';

const userModel = new UserModel();
const sessionModel = new SessionModel();



export const register = async (
    body: IRegisterBody,
): Promise<{ user: Partial<IUserModel>; authorization: string; tempEmail: string  }> => {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const token = randomUUID();

    const userId = await userModel.createUser({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        token,
        isActive: true,
    });

   
    const address = generateTempEmailAddress();
    await sessionModel.createUserSession({ userId, token, address });

    const authorization = JwtUtils.signToken({ userId, token });

    const user = await userModel.getByToken(token);

    return {
        user: user as IUserModel,
        authorization,
        tempEmail: address,
    };
};

export const login = async (
    user: IUserModel,
): Promise<{ user: Partial<IUserModel>; authorization: string; tempEmail: string }> => {
    const authorization = JwtUtils.signToken({ userId: user.id, token: user.token });

    const session = await sessionModel.getUserSession(user.id);
    const { password, ...registeredUser } = user as IUserModel;

    return {
        user: registeredUser,
        authorization,
        tempEmail: session!.address as string,
    };
};


export const getUserByToken = (token: string): Promise<IUserModel | undefined> => {
    return userModel.getByToken(token);
};