import configJson from './config.json' with { type: 'json' };

export default {
    port: process.env.PORT || configJson.main.port || 3000,

    db: {
        // если есть DATABASE_URL (Alwaysdata) — используем её
        connectionString: process.env.DATABASE_URL || null,

        // fallback для локальной разработки
        host: process.env.DB_HOST || configJson.db.host,
        port: process.env.DB_PORT || configJson.db.port,
        user: process.env.DB_USER || configJson.db.user,
        password: process.env.DB_PASSWORD || configJson.db.password,
        database: process.env.DB_NAME || configJson.db.defaultDatabase,
    }
};