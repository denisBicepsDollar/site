import configJson from './config.json' with { type: 'json' };

export default {
    port: process.env.PORT || configJson.main.port || 3000,

    db: {
        connectionString: process.env.DATABASE_URL || null,
        host:            process.env.DB_HOST     || configJson.db.host,
        port:            process.env.DB_PORT     || configJson.db.port,
        user:            process.env.DB_USER     || configJson.db.user,
        password:        process.env.DB_PASSWORD || configJson.db.password,
        database:        process.env.DB_NAME     || configJson.db.defaultDatabase,
        reportsDatabase: process.env.DB_REPORTS  || configJson.db.reportsDatabase,
    }
};