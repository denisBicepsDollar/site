import * as authService from '../services/Auth/authService.js';
import logger from "../utils/logger.js";

const logModule = logger.child({
    module: 'authController'
})


export async function login(req, res) {

    const log = logModule.child({
        function: 'login'
    })

    log.debug(`[authController] login attempt for username: ${req.body.username}`);

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
