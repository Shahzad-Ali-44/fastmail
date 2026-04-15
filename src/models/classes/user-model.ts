import type { IUserModel } from '../interfaces/user-model.js';
import { BaseModel } from './base-model.js';

export class UserModel extends BaseModel<IUserModel> {
    public static TABLE_NAME = 'users';
    public static ALIAS = 'U';

    public static COL_FIRST_NAME = `${UserModel.ALIAS}.firstName`;
    public static COL_LAST_NAME = `${UserModel.ALIAS}.lastName`;
    public static COL_EMAIL = `${UserModel.ALIAS}.email`;
    public static COL_PASSWORD = `${UserModel.ALIAS}.password`;
    public static COL_TOKEN = `${UserModel.ALIAS}.token`;
    public static COL_IS_ACTIVE = `${UserModel.ALIAS}.isActive`;

    public static COLUMNS = [
        UserModel.COL_FIRST_NAME,
        UserModel.COL_LAST_NAME,
        UserModel.COL_EMAIL,
        UserModel.COL_TOKEN,
        UserModel.COL_IS_ACTIVE,
    ];

    public constructor() {
        super(UserModel.TABLE_NAME, UserModel.ALIAS, UserModel.COLUMNS);
    }

    public getByEmail(email: string): Promise<IUserModel | undefined> {
        return this.aTable
            .columns(UserModel.COLUMNS)
            .columns([UserModel.COL_PASSWORD, this.colCreatedAt, this.colUpdatedAt])
            .where(`${UserModel.ALIAS}.email`, email)
            .first() as Promise<IUserModel | undefined>;
    }

    public getByToken(token: string): Promise<IUserModel | undefined> {
        return this.aTable
            .columns(UserModel.COLUMNS)
            .columns([this.colCreatedAt, this.colUpdatedAt])
            .where(`${UserModel.ALIAS}.token`, token)
            .first() as Promise<IUserModel | undefined>;
    }
}
