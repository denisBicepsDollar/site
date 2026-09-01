import * as authService from '../services/Auth/authService.js';

export async function login(req, res) {
    try {
        console.log(`[authController] login ${JSON.stringify(req.body)}`);

        const payload = req.body;
        const {username, password} = payload;

        const token = await authService.login(username, password);

        if (!token) {
            return res.status(401).json({error: 'Неверный логин или пароль'});
        }

        return res.status(200).json({token});

    } catch (err) {
        console.error(`[authController] login error:`, err.message);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}