import type { IUserModel } from '../models/interfaces/user-model.js';
import type { IPagination } from './pagination.js';

export interface IState {
    message: string;
    status: number;
    data: any | null;
    body?: any;
    responseContentType?: any;
    totalCount?: number;
    pagination: IPagination;
    authorization: string;
    siUser: IUserModel;
    [key: string]: any;
}
