import jwt from "jsonwebtoken";
import config from "../config/index.js";
import {ApiError} from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const logModule = logger.child({
    module: 'Middleware'
})

export default async function authHandler(req, res, next) {
    const log = logModule.child({
        function: 'authHandler'
    })
    log.debug({ip: req.ip});

    const token = req.cookies.token;
    if (!token) {
        throw new ApiError(401, "No token provided");
    }
    const secretKey = config.secretKey;
    const decoded = jwt.verify(token, secretKey);

    if (!decoded) {
        throw new ApiError(401, "Invalid token");
    }

    req.user = decoded;

    next();
}
