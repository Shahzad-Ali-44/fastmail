import Boom from '@hapi/boom';
import type { Knex } from 'knex';
import { db } from '../../utils/knex-init.js';
import type { IBaseModel } from '../interfaces/model.js';
import type { IPagination } from '../../interfaces/pagination.js';

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

    protected get aTableWithColumns(): Knex.QueryBuilder<any, T[]> {
        return this.aTable
            .columns(this.columns as string[])
            .columns([this.colCreatedAt, this.colUpdatedAt]);
    }

    public get(pagination: IPagination | null = {}): Knex.QueryBuilder<any, T[]> {
        const qb = this.aTableWithColumns;
        if (pagination !== null) {
            qb.limit(pagination?.limit ?? 5000);
            qb.offset(pagination?.offset ?? 0);
        }
        return qb;
    }

    public insert(data: Partial<T>): Promise<number> {
        return this.table.insert(data).returning('id').then((rows) => rows[0].id);
    }

    public update(data: Partial<Readonly<T>>): Knex.QueryBuilder<any, number> {
        const cleaned = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined),
        );
        if (Object.keys(cleaned).length === 0) {
            throw Boom.badRequest('Pass at least one value to update');
        }
        return this.aTable.update(cleaned);
    }

    public delete(): Knex.QueryBuilder<any, T[]> {
        return this.aTable.delete();
    }
}
