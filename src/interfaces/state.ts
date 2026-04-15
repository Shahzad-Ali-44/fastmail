import type { IUserModel } from '../models/interfaces/user-model.js';

export interface IState {
    message: string;
    status: number;
    data: any | null;
    body?: any;
    authorization: string;
    siUser: IUserModel;
    [key: string]: any;
}
