import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('firstName', 150).notNullable();
        table.string('lastName', 150).notNullable();
        table.string('email', 255).notNullable().unique();
        table.string('password', 255).notNullable();
        table.string('token', 100).notNullable().unique();
        table.boolean('isActive').notNullable().defaultTo(true);
        table.timestamps(true, true);
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTableIfExists('users');
};
