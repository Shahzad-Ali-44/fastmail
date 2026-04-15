import 'dotenv/config';
import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
        directory: './migrations',
        extension: 'ts',
    },
});

const command = process.argv[2];

if (command === 'rollback') {
    db.migrate.rollback()
        .then(() => {
            console.log('Migration rolled back successfully');
            process.exit(0);
        })
        .catch((err: Error) => {
            console.error('Migration rollback failed:', err.message);
            process.exit(1);
        });
} else {
    db.migrate.latest()
        .then(() => {
            console.log('Migration ran successfully');
            process.exit(0);
        })
        .catch((err: Error) => {
            console.error('Migration failed:', err.message);
            process.exit(1);
        });
}
