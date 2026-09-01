import 'dotenv/config';

export default {
    port: process.env.PORT || 3000,
    secretKey: process.env.SECRET_KEY,

    db:
        {
            catalogConnectionString: process.env.CATALOG_URL || null,
            reportsConnectionString: process.env.REPORTS_URL || null,
            usersConnectionString: process.env.USERS_URL || null,
        },
};