import type { IBaseModel } from './model.js';

export interface IUserModel extends IBaseModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token: string;
    isActive: boolean;
    authorization?: string;
}
