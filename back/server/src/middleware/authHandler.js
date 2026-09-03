import jwt from "jsonwebtoken";
import config from "../config/index.js";

export default async function authHandler(req, res, next) {
    try {
        console.log(`[authMiddleware] authHandler ${req.cookies.token}`);

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({message: 'Invalid token'});
        }
        const secretKey = config.secretKey;
        const decoded = jwt.verify(token, secretKey);

        if (!decoded) {
            return res.status(401).json({message: 'Invalid token'});
        }


        req.user = decoded;

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({message: 'Invalid token'});
        }
        console.error(`[authMiddleware] authHandler error:`, err.message);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}
