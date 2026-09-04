// ── server.js ─────────────────────────────────────────────────────────────────
// Точка входа HTTP-сервера. Инициализирует Express, подключает middleware и роуты.
// errorHandler регистрируется ПОСЛЕ роутов — иначе он не перехватит ошибки из них.

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import errorHandler from './middleware/errorHandler.js';
import {registerRoutes} from './routes/routes.js';
import {apiLimiter} from "./middleware/rateLimiters.js";
import {ApiError} from "./utils/ApiError.js";



async function startServer() {
    const app = express();

    app.set('trust proxy', 1);

    app.use(cors({
        origin: ['http://localhost:5173',
            'http://127.0.0.1:5173',
        ],
        credentials: true,
    }));

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(cookieParser());

    app.use('/api/', apiLimiter);

    registerRoutes(app);

    app.use(() => {
        throw new ApiError(404);
    });

    // errorHandler должен быть последним middleware
    app.use(errorHandler);

    const port = config.port;


    app.listen(port, () => {
        console.log(`[server] started on port ${port}`);
    });
}

startServer().catch(err => {
    console.error('[server] Критическая ошибка при запуске:', err);
    process.exit(1);
});