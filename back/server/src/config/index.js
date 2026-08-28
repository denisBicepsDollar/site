import {config as dotenvConfig} from 'dotenv';
import path from 'path';

const envPath = path.resolve(import.meta.dirname, '../../../../.env');

dotenvConfig({path: envPath});

export default {
    port: process.env.PORT || 3000,

    db:
        {
            dbConnectionString: process.env.DATABASE_URL || null,
            reportsConnectionString: process.env.REPORTS_URL || null,
        },
};