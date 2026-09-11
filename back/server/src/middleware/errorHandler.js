// ── errorHandler.js ───────────────────────────────────────────────────────────
// Глобальный обработчик ошибок Express (4 аргумента — обязательно).
// Должен регистрироваться ПОСЛЕДНИМ после всех роутов в server.js,
// иначе не будет перехватывать ошибки переданные через next(err).

import {ApiError} from "../utils/ApiError.js";
import config from "../config/index.js"
import logger from "../utils/logger.js";

const logModule = logger.child({
    module: 'Middleware'
})
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, _next) {

    const log = logModule.child({
        module: 'errorHandler',
    })

    log.error({method: req.method, url : req.url, err});

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            status: 'error',
            message: err.message,
        })
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
        })
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token',
        })
    }

    const isDev = config.env === 'development';


    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        ...(isDev && {details: err.message, stack: err.stack})
    });
}