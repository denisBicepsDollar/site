import { initCrashHandler } from './utils/terminate.js'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import errorHandler from './middleware/errorHandler.js';
import {registerRoutes} from './routes/routes.js';
import {apiLimiter} from './middleware/rateLimiters.js';
import {ApiError} from './utils/ApiError.js';
import {fileURLToPath} from "url";
import getLogger from "./utils/logger.js";
import {requestContext} from "./middleware/requestContext.js";
import {accessLogger} from "./middleware/accessLogger.js";

const server = { instance : null }
initCrashHandler({httpServer: server})

const moduleName = 'server';

const log = getLogger(moduleName);


export function createApp() {
    const app = express();

    app.set('trust proxy', 1);

    app.use(cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true,
    }));
    app.use(accessLogger);

    app.use(requestContext)

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

    app.use('/api/', apiLimiter);

    registerRoutes(app);

    app.use(() => {
        throw new ApiError(404);
    });


    app.use(errorHandler);

    return app;
}

export function startServer() {
    const app = createApp();
    const port = config.port;
    const env = config.env

    const runningServer = app.listen(port, () => {
        log.info({port, env}, 'started');
    });
    server.instance = runningServer;

    return runningServer;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startServer();
}