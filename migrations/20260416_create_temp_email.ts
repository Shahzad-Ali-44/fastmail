import type { Knex } from 'knex';

export const up = async (knex: Knex): Promise<void> => {
    await knex.schema.createTable('temp_emails', (table) => {
        table.increments('id').primary();
        table.integer('userId').notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
        table.string('address', 320).notNullable().unique();
        table.boolean('isActive').notNullable().defaultTo(true);
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('temp_email_messages', (table) => {
        table.increments('id').primary();
        table.integer('tempEmailId').notNullable().references('id').inTable('temp_emails').onDelete('CASCADE');
        table.string('fromAddress', 320).nullable();
        table.string('subject', 500).nullable();
        table.text('textBody').nullable();
        table.text('htmlBody').nullable();
        table.jsonb('raw').nullable();
        table.timestamp('receivedAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
        table.index(['tempEmailId', 'receivedAt']);
    });
};

export const down = async (knex: Knex): Promise<void> => {
    await knex.schema.dropTableIfExists('temp_email_messages');
    await knex.schema.dropTableIfExists('temp_emails');
};