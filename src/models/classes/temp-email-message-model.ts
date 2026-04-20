import type { ITempEmailMessageModel } from '../interfaces/temp-email-message-model.js';
import { BaseModel } from './base-model.js';

export class TempEmailMessageModel extends BaseModel<ITempEmailMessageModel> {

    public static TABLE_NAME = 'temp_email_messages';
    public static ALIAS = 'TEM';

    public static COL_SESSION_ID = `${TempEmailMessageModel.ALIAS}.sessionId`;
    public static COL_FROM_ADDRESS = `${TempEmailMessageModel.ALIAS}.fromAddress`;
    public static COL_SUBJECT = `${TempEmailMessageModel.ALIAS}.subject`;
    public static COL_TEXT_BODY = `${TempEmailMessageModel.ALIAS}.textBody`;
    public static COL_HTML_BODY = `${TempEmailMessageModel.ALIAS}.htmlBody`;
    public static COL_RAW = `${TempEmailMessageModel.ALIAS}.raw`;
    public static COL_RECEIVED_AT = `${TempEmailMessageModel.ALIAS}.receivedAt`;

    public static COLUMNS = [
        TempEmailMessageModel.COL_SESSION_ID,
        TempEmailMessageModel.COL_FROM_ADDRESS,
        TempEmailMessageModel.COL_SUBJECT,
        TempEmailMessageModel.COL_TEXT_BODY,
        TempEmailMessageModel.COL_HTML_BODY,
        TempEmailMessageModel.COL_RAW,
        TempEmailMessageModel.COL_RECEIVED_AT,
    ];

    public constructor() {
        super(TempEmailMessageModel.TABLE_NAME, TempEmailMessageModel.ALIAS, TempEmailMessageModel.COLUMNS);
    }

    public listBySessionId(sessionId: number, opts: { limit: number; offset: number }): Promise<ITempEmailMessageModel[]> {
        return this.table
            .where('sessionId', sessionId)
            .orderBy('receivedAt', 'desc')
            .limit(opts.limit)
            .offset(opts.offset) as Promise<ITempEmailMessageModel[]>;
    }

    public createFromInbound(data: {
        sessionId: number;
        fromAddress: string | null;
        subject: string | null;
        textBody: string | null;
        htmlBody: string | null;
        raw: Record<string, any>;
        receivedAt: Date;
    }): Promise<number> {
        return this.insert(data);
    }
}
