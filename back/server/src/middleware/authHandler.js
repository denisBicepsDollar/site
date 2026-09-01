import jwt from "jsonwebtoken";

export default async function authHandler(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Неверный формат авторизации'});
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Токен не передан'});
    }

    try {

        const secretKey = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;

        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({error: 'Неверный или просроченный токен'});
    }
}