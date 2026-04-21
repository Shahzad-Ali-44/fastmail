import { db } from '../../utils/knex-init.js';
import type { ISessionModel } from '../interfaces/session-model.js';
import { TempEmailMessageModel } from './temp-email-message-model.js';
import { BaseModel } from './base-model.js';

export class SessionModel extends BaseModel<ISessionModel> {
    public static TABLE_NAME = 'sessions';
    public static ALIAS = 'S';

    public static COL_TOKEN = `${SessionModel.ALIAS}.token`;
    public static COL_ADDRESS = `${SessionModel.ALIAS}.address`;
    public static COL_USER_ID = `${SessionModel.ALIAS}.userId`;

    public static COLUMNS = [
        `${SessionModel.ALIAS}.id`,
        SessionModel.COL_TOKEN,
        SessionModel.COL_ADDRESS,
        SessionModel.COL_USER_ID,
    ];

    private readonly tempEmailMessageModel = new TempEmailMessageModel();

    public constructor() {
        super(SessionModel.TABLE_NAME, SessionModel.ALIAS, SessionModel.COLUMNS);
    }

    public getByToken(token: string): Promise<ISessionModel | undefined> {
        return this.aTable
            .columns(SessionModel.COLUMNS)
            .columns([this.colCreatedAt, this.colUpdatedAt])
            .where(SessionModel.COL_TOKEN, token)
            .first() as Promise<ISessionModel | undefined>;
    }

    public getByAddress(address: string): Promise<ISessionModel | undefined> {
        return this.aTable
            .columns(SessionModel.COLUMNS)
            .columns([this.colCreatedAt, this.colUpdatedAt])
            .where(SessionModel.COL_ADDRESS, address)
            .first() as Promise<ISessionModel | undefined>;
    }

    public createSession(data: { token: string; address: string }): Promise<number> {
        return this.insert(data);
    }

    public getUserSession(userId: number): Promise<ISessionModel | undefined> {
        return this.aTable
            .columns(SessionModel.COLUMNS)
            .columns([this.colCreatedAt, this.colUpdatedAt])
            .where(SessionModel.COL_USER_ID, userId)
            .first() as Promise<ISessionModel | undefined>;
    }

    public createUserSession(data: { userId: number; token: string; address: string }): Promise<number> {
        return this.insert(data);
    }

    public async replaceAddress(data: { sessionId: number; newAddress: string }): Promise<void> {
        await db.transaction(async (trx) => {
            await this.tempEmailMessageModel.aTable
                .where(TempEmailMessageModel.COL_SESSION_ID, data.sessionId)
                .del()
                .transacting(trx);

            await this.table
                .where('id', data.sessionId)
                .update({ address: data.newAddress, updatedAt: db.fn.now() })
                .transacting(trx);
        });
    }
}
