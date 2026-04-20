import bcrypt from 'bcryptjs';
import { UserModel } from '../models/classes/user-model.js';
import type { IUserModel } from '../models/interfaces/user-model.js';
import * as JwtUtils from '../utils/jwt-utils.js';
import type { IRegisterBody } from '../interfaces/user.js';
import * as TempEmailService from './temp-email.js';



const userModel = new UserModel();



const generateToken = (): string => {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
};



export const register = async (body: IRegisterBody): Promise<{ user: Partial<IUserModel>; authorization: string; tempEmail: { address: string } }> => {
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
    const tempEmail = await TempEmailService.getCurrentTempEmailForUser(userId);

    return {
        user: user as IUserModel,
        authorization,
        tempEmail,
    };

};




export const login = async (user: IUserModel): Promise<{ user: Partial<IUserModel>; authorization: string; tempEmail: { address: string } }> => {
    const authorization = JwtUtils.signToken({ userId: user.id, token: user.token });

    const { password, ...registeredUser } = user as IUserModel;
    const tempEmail = await TempEmailService.getCurrentTempEmailForUser(user.id);

    return {
        user: registeredUser,
        authorization,
        tempEmail,
    };
};




export const getUserByToken = async (token: string): Promise<IUserModel | undefined> => {

    try {

        const payload = JwtUtils.verifyToken(token);

        if (!payload.token) 
            {
            return undefined;
        }

        return await userModel.getByToken(payload.token);

    } catch 
    {
        return undefined;
    }
};
