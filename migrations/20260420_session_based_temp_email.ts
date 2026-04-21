import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
   

    await knex.schema.createTable('sessions', (table) => {
        table.increments('id').primary();
        table.uuid('token').notNullable().unique();
        table.string('address', 320).notNullable().unique();
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('temp_email_messages', (table) => {
        table.increments('id').primary();
        table.integer('sessionId').notNullable().references('id').inTable('sessions').onDelete('CASCADE');
        table.string('fromAddress', 320).nullable();
        table.string('subject', 500).nullable();
        table.text('textBody').nullable();
        table.text('htmlBody').nullable();
        table.timestamp('receivedAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
        table.index(['sessionId', 'receivedAt']);
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTableIfExists('temp_email_messages');
    await knex.schema.dropTableIfExists('sessions');
};
