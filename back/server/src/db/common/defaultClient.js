import pg from 'pg';
import config from '../../config/index.js';

if (!config.db.catalogConnectionString) {
    throw new Error('Main database connection string is missing');
}

const pool = new pg.Pool
(
    {
        connectionString: config.db.catalogConnectionString,
    },
);

pool.on('connect', () => {
    console.log('Открыто соединение с главной БД');
});


pool.on('error', (err) => {
    console.error('Ошибка пула главной БД:', err.message);
});


export default pool;