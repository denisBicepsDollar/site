import pg from 'pg';
import config from '../../config/index.js';
import getLogger from "../../utils/logger.js";
const moduleName = 'authClient';

const log = getLogger(moduleName);



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
    log.info("База users connected");
});
pool.on('debug', (err) => {
    log.error({
        message: err.message,
        code: err.code,
        severity: err.severity }, "Ошибка при подключении users");
});

export default pool;