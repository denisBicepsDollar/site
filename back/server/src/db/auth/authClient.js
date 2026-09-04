import pg from 'pg';
import config from '../../config/index.js';

if (!config.db.usersConnectionString) {
    throw new Error('Users database connection string is missing');
}

const pool = new pg.Pool
(
    {
        connectionString: config.db.usersConnectionString,
    },
);

pool.on('connect', () => {
    console.log("База users connected");
});
pool.on('error', (err) => {
    console.log("Ошибка при подключении users", err.message);
});

export default pool;