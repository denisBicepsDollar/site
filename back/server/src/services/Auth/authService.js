import * as authRepo from "../../db/auth/authRepo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";
import {ApiError} from "../../utils/ApiError.js";

export async function login(username, password) {
    const user = await authRepo.findUserByUsername(username);

    if (!user) {
        throw new ApiError(401, "Invalid username or password");
    }

    const isMatch = await bcrypt.compare(String(password), user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid username or password");
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
