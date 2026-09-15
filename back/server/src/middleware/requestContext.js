import {AsyncLocalStorage} from "node:async_hooks";
import getLogger from "../utils/logger.js";

const moduleName = 'Middleware';

export const loggerStorage = new AsyncLocalStorage()


export async function requestContext(req, res, next) {
    const request_id = req.headers['x-request-id'] ?? crypto.randomUUID();

    res.setHeader('X-Request-Id', request_id);

    const logModule = getLogger(moduleName);

    const log = logModule.child({
        request_id
    })

    loggerStorage.run({request_id, log}, () => next())

}