// ── reportsClient.js ──────────────────────────────────────────────────────────
// Пул соединений к БД отчётов (reports).
// Отдельная БД используется чтобы изолировать таблицу reports от основных данных.
// Структура идентична defaultClient — отличается только database.
import pg from 'pg';
import config from '../../config/index.js';
import getLogger from "../../utils/logger.js";

const moduleName = 'reportsClient';

const log = getLogger(moduleName);
if (!config.db.reportsConnectionString) {
    throw new Error('Reports database connection string is missing');
}

const pool = new pg.Pool
(
    {
        connectionString: config.db.reportsConnectionString,
    },
);

pool.on('connect', () => {
    
});


pool.on('error', (err) => {
    log.debug({
        message: err.message,
        code: err.code,
        severity: err.severity }, 'Ошибка пула отчетной БД');
});

export default pool;