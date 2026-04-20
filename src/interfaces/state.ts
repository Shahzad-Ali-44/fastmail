import type { ISessionModel } from '../models/interfaces/session-model.js';

export interface IState {
    message: string;
    status: number;
    data: any | null;
    body?: any;
    session: ISessionModel;
    [key: string]: any;
}
