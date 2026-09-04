import jwt from "jsonwebtoken";
import config from "../config/index.js";
import {ApiError} from "../utils/ApiError.js";

export default async function authHandler(req, res, next) {
    console.log(`[authMiddleware] authHandler ${req.ip}`);

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
