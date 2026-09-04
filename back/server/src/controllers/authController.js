import * as authService from '../services/Auth/authService.js';

export async function login(req, res) {
    console.log(`[authController] login attempt for username: ${req.body.username}`);

    const payload = req.body;
    const {username, password} = payload;

    const token = await authService.login(username, password);

    return res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })
        .json({message: "ok"});

}
