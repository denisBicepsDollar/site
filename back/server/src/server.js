// ── server.js ─────────────────────────────────────────────────────────────────
// Точка входа HTTP-сервера. Инициализирует Express, подключает middleware и роуты.
// errorHandler регистрируется ПОСЛЕ роутов — иначе он не перехватит ошибки из них.

import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import errorHandler from './middleware/errorHandler.js';
import { registerRoutes } from './routes.js';
import path from 'path';
import {fileURLToPath} from "url";
import rateLimit from 'express-rate-limit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
    const app = express();

    app.use(cors({
        origin: ['http://localhost:5173',
                 'http://127.0.0.1:5173',
        ],
        credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const shopPath = path.join(__dirname, '../../../', 'shop');
    app.use(express.static(shopPath));

    registerRoutes(app);

    // errorHandler должен быть последним middleware
    app.use(errorHandler);

    const port = config.port;
    app.listen(port, () => {
        console.log(`[server] started on port ${port}`);
        console.log(`Магазин: http://localhost:${port}`);
        console.log(`API:    http://localhost:${port}/tables`);
    });
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 минут
        max: 100,                  // макс запросов
        message: { error: 'Слишком много запросов, попробуйте позже' }
    });

    app.use('/api/', limiter);
}

startServer().catch(err => {
    console.error('[server] ошибка при запуске:', err);
    process.exit(1);
});