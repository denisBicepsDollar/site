import * as authRepo from "../../db/auth/authRepo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";

export async function login(username, password) {
    const user = await authRepo.findUserByUsername(username);

    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(String(password), user.password);

    if (!isMatch) {
        return null;
    }

    const payload =
        {
            id: user.id,
            username: user.username,
            role: user.role,
        };
    const secretKey = config.secretKey;

    const token = jwt.sign(
        payload,
        secretKey,
        {
            expiresIn: '1d',
        },
    );

    return token;
}
