import * as authService from "@/services/authService";
import getLogger from "@/utils/logger";

const moduleName = "authController";

function buildCookieOptions(req) {
  const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https";
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && isHttps,
    sameSite: "lax",
    path: "/",
  };
}

export async function login(req, res) {
  const log = getLogger(moduleName).child({
    function: "login",
  });

  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const { username, password } = payload;

  log.debug(`attempt for username: ${typeof username === "string" ? username : ""}`);

  const token = await authService.login(username, password);

  res.set("Cache-Control", "no-store");
  return res
    .status(200)
    .cookie("token", token, {
      ...buildCookieOptions(req),
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({ message: "ok" });
}

export async function logout(req, res) {
  const options = buildCookieOptions(req);
  res.set("Cache-Control", "no-store");
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  if (options.secure) {
    res.clearCookie("token", options);
  }
  return res.status(200).json({ message: "ok" });
}
