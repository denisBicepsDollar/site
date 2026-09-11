import 'dotenv/config';

export default {
    port: 3000,
    secretKey: process.env.SECRET_KEY,
    env: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'debug',
    serviceName: process.env.SERVICE_NAME || 'app-service',

    db:
        {
            catalogConnectionString: process.env.CATALOG_URL || null,
            reportsConnectionString: process.env.REPORTS_URL || null,
            usersConnectionString: process.env.USERS_URL || null,
        },
};