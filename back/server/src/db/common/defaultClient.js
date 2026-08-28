import pg from 'pg';
import config from '../../config/index.js';

if (!config.db.dbConnectionString) {
    throw new Error('Ошибка в строке подключения главной бд при создании пула');
}

const pool = new pg.Pool
(
    {
        connectionString: config.db.dbConnectionString,
    },
);

pool.on('connect', () => {
    console.log('Открыто соединение с главной БД');
});


pool.on('error', (err) => {
    console.error('Ошибка пула главной БД:', err.message);
});


export default pool;