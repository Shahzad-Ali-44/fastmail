import type { ISessionModel } from '../models/interfaces/session-model.js';
import type { IUserModel } from '../models/interfaces/user-model.js';

export interface IState {
    message: string;
    status: number;
    data: any | null;
    body?: any;
    session: ISessionModel;
    siUser: IUserModel;
    [key: string]: any;
}
