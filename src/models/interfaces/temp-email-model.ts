import type { IBaseModel } from './model.js';

export interface ITempEmailModel extends IBaseModel {
    userId: number;
    address: string;
    isActive: boolean;
}

