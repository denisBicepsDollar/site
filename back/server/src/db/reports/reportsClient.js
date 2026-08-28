// ── reportsClient.js ──────────────────────────────────────────────────────────
// Пул соединений к БД отчётов (reports).
// Отдельная БД используется чтобы изолировать таблицу reports от основных данных.
// Структура идентична defaultClient — отличается только database.
import pg from 'pg';
import config from '../../config/index.js';

if (!config.db.reportsConnectionString) {
    throw new Error('Ошибка в строке подключения отчетной бд при создании пула');
}

const pool = new pg.Pool
(
    {
        connectionString: config.db.reportsConnectionString,
    },
);

pool.on('connect', () => {
    console.log('Открыто соединение с отчетной БД');
});


pool.on('error', (err) => {
    console.error('Ошибка пула отчетной БД:', err.message);
});

export default pool;