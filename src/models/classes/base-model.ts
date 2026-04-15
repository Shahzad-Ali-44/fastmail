import type { Knex } from 'knex';
import { db } from '../../utils/knex-init.js';
import type { IBaseModel } from '../interfaces/model.js';

export abstract class BaseModel<T extends IBaseModel> {

    protected constructor(
        protected readonly tableName: string,
        protected readonly alias: string,
        protected readonly columns: ReadonlyArray<string>,
    ) {}

    public get colCreatedAt(): string {
        return `${this.alias}.createdAt`;
    }

    public get colUpdatedAt(): string {
        return `${this.alias}.updatedAt`;
    }

    public get aTable(): Knex.QueryBuilder<any, T[]> {
        const identifier: Record<string, string> = {};
        identifier[this.alias] = this.tableName;
        return db(identifier);
    }

    protected get table(): Knex.QueryBuilder<any, T[]> {
        return db(this.tableName);
    }

    public insert(data: Partial<T>): Promise<number> {
        return this.table.insert(data).returning('id').then((rows) => rows[0].id);
    }
}
