import pg from 'pg';
import config from '../../config/index.js';
import logger from "../../utils/logger.js";
const log = logger.child({
    module: 'authClient'
})


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
pool.on('error', (err) => {
    log.error({ err }, "Ошибка при подключении users");
});

export default pool;