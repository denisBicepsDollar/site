// ── errorHandler.js ───────────────────────────────────────────────────────────
// Глобальный обработчик ошибок Express (4 аргумента — обязательно).
// Должен регистрироваться ПОСЛЕДНИМ после всех роутов в server.js,
// иначе не будет перехватывать ошибки переданные через next(err).

import {ApiError} from "../utils/ApiError.js";
import config from "../config/index.js"
import getLogger from "../utils/logger.js";
import {loggerStorage} from "./requestContext.js";

const moduleName = 'Middleware'
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, _next) {

    const request_id = loggerStorage.getStore()?.request_id

    const log = getLogger(moduleName).child({
        function: 'errorHandler',
    })

    if (err instanceof ApiError) {
        log.warn({
            status: err.status,
            message: err.message,
            request_id
        }, 'API Expected Warning');

        return res.status(err.status).json({
            status: 'error',
            request_id,
            message: err.message,
        })
    }

    if (err.name === 'ValidationError') {
        log.warn({
            status: 400,
            message: err.message,
            request_id
        }, 'Validation Warning');

        return res.status(400).json({
            status: 'error',
            request_id,
            message: 'Validation error',
        })
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        log.warn({
            status: 401,
            message: err.message,
            request_id
        }, 'Token Warning');

        return res.status(401).json({
            status: 'error',
            request_id,
            message: 'Invalid token',
        })
    }

    const isDev = config.env === 'development';

    log.error({
        status: 500,
        errorType: err.name || 'Error',
        message: err.message,
        request_id,
        stack: err.stack
    }, 'Internal Server Crash');

    return res.status(500).json({
        status: 'error',
        request_id,
        message: 'Internal server error',
        ...(isDev && {details: err.message, stack: err.stack})
    });
}