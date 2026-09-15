import pg from 'pg';
import config from '../../config/index.js';
import getLogger from "../../utils/logger.js";

const moduleName = 'defaultClient';

const log = getLogger(moduleName);


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
    log.info('Открыто соединение с главной БД');
});


pool.on('error', (err) => {
    log.error({ err },'Ошибка пула главной БД');
});


export default pool;