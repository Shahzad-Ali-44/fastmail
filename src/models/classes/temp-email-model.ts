import { db } from '../../utils/knex-init.js';
import type { ITempEmailModel } from '../interfaces/temp-email-model.js';
import { BaseModel } from './base-model.js';
import { TempEmailMessageModel } from './temp-email-message-model.js';

export class TempEmailModel extends BaseModel<ITempEmailModel> {
    public static TABLE_NAME = 'temp_emails';
    public static ALIAS = 'TE';

    public static COL_USER_ID = `${TempEmailModel.ALIAS}.userId`;
    public static COL_ADDRESS = `${TempEmailModel.ALIAS}.address`;
    public static COL_IS_ACTIVE = `${TempEmailModel.ALIAS}.isActive`;

    private readonly tempEmailMessageModel = new TempEmailMessageModel();

    public static COLUMNS = [
        TempEmailModel.COL_USER_ID,
        TempEmailModel.COL_ADDRESS,
        TempEmailModel.COL_IS_ACTIVE,
    ];

    public constructor() {
        super(TempEmailModel.TABLE_NAME, TempEmailModel.ALIAS, TempEmailModel.COLUMNS);
    }

    public getTempEmailByUserId(userId: number): Promise<ITempEmailModel | undefined> {
        return this.aTable
            .columns(TempEmailModel.COLUMNS)
            .columns([this.colCreatedAt, this.colUpdatedAt, `${TempEmailModel.ALIAS}.id`])
            .where(TempEmailModel.COL_USER_ID, userId)
            .first() as Promise<ITempEmailModel | undefined>;
    }

    public getByAddress(address: string): Promise<ITempEmailModel | undefined> {
        return this.aTable
            .columns(TempEmailModel.COLUMNS)
            .columns([this.colCreatedAt, this.colUpdatedAt, `${TempEmailModel.ALIAS}.id`])
            .where(TempEmailModel.COL_ADDRESS, address)
            .first() as Promise<ITempEmailModel | undefined>;
    }

    public createTempEmailForUser(data: { userId: number; address: string }): Promise<number> {
        return this.insert({
            userId: data.userId,
            address: data.address,
            isActive: true,
        });
    }

   

    public async replaceTempEmailForUser(data: { userId: number; newAddress: string }): Promise<void> {
        await db.transaction(async (trx) => {
            const existing = await this.aTable
                .columns(TempEmailModel.COLUMNS)
                .columns([this.colCreatedAt, this.colUpdatedAt, `${TempEmailModel.ALIAS}.id`])
                .where(TempEmailModel.COL_USER_ID, data.userId)
                .first()
                .transacting(trx);
            if (existing?.id) {
                await this.tempEmailMessageModel.aTable
                    .where(TempEmailMessageModel.COL_TEMP_EMAIL_ID, existing.id)
                    .del()
                    .transacting(trx);
                await this.aTable
                    .where(`${TempEmailModel.ALIAS}.id`, existing.id)
                    .del()
                    .transacting(trx);
            }
            await this.table
                .insert({ userId: data.userId, address: data.newAddress, isActive: true })
                .transacting(trx);
        });
    }
}

