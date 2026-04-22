import knex, { type Knex } from 'knex';
import 'dotenv/config';

export const db: Knex = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        timezone: 'UTC',
    },
    migrations: {
        directory: './migrations',
        extension: 'ts',
    },
});
