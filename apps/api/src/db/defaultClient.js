import pg from 'pg';
import config from '../config/index.js';
import getLogger from "../utils/logger.js";

const moduleName = 'defaultClient';

const log = getLogger(moduleName);


if (!config.db.connectionString) {
    throw new Error('Main database connection string is missing');
}

const pool = new pg.Pool
(
    {
        connectionString: config.db.connectionString,
    },
);

pool.on('connect', () => {
    log.info('Открыто соединение с главной БД');
});


pool.on('error', (err) => {
    log.debug({
        message: err.message,
        code: err.code,
        severity: err.severity
    }, 'Ошибка пула главной БД');
});


export default pool;