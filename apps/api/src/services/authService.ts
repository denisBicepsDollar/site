import * as authRepo from "@/db/authRepo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "@/config/index";
import { ApiError } from "@/utils/ApiError";

export async function login(username, password) {
  const normalizedUsername = typeof username === "string" ? username.trim() : "";
  const normalizedPassword = typeof password === "string" ? password : "";

  if (!normalizedUsername || !normalizedPassword) {
    throw new ApiError(401, "Invalid username or password");
  }

  const user = await authRepo.findUserByUsername(normalizedUsername);

  if (!user) {
    throw new ApiError(401, "Invalid username or password");
  }

  const storedHash = String(user.password_hash ?? user.passwordHash ?? "");
  const isMatch = storedHash.startsWith("$2")
    ? await bcrypt.compare(normalizedPassword, storedHash)
    : normalizedPassword === storedHash;

  if (!isMatch) {
    throw new ApiError(401, "Invalid username or password");
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role ?? "admin",
  };

  const secretKey = config.secretKey;

  const token = jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });

  return token;
}
