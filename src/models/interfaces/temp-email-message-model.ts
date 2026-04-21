import type { IBaseModel } from './model.js';

export interface ITempEmailMessageModel extends IBaseModel {
    sessionId: number;
    fromAddress: string;
    subject: string | null;
    textBody: string | null;
    htmlBody: string | null;
    receivedAt: Date;
}

