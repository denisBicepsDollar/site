import * as authService from '../services/Auth/authService.js';



export async function login(req, res) {
    try {
        console.log(`[authController] login ${JSON.stringify(req.body)}`);

        const payload = req.body;
        const {username, password} = payload;

        const token = await authService.login(username, password);

        if (!token) {
            console.log(`[authController] login failed`,
                {
                    ip: req.ip,
                    username,
                    reason: "invalid credentials",
                },
            );
            return res.status(401).json({ error: "Invalid credentials" });;
        }

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            })
            .json({message: "ok"});

    } catch (err) {
        console.error(`[authController] login error:`, err.message);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}
