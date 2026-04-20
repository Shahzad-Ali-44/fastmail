import type { IBaseModel } from './model.js';

export interface ISessionModel extends IBaseModel {
    token: string;
    address: string;
}
