import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: 'error',
        error: 'Too many requests',},
});
export const authLimiter = rateLimit({
    windowMs: 12 * 60 * 60 * 1000, // 12 часов
    max: 3,
    statusCode: 429,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: 'error',
        message: 'Too many requests',
    },
});