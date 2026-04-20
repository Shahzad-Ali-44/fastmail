import type { IBaseModel } from './model.js';

export interface ITempEmailMessageModel extends IBaseModel {
    tempEmailId: number;
    fromAddress: string | null;
    subject: string | null;
    textBody: string | null;
    htmlBody: string | null;
    raw: any | null;
    receivedAt: Date;
}

