import dotenv from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
let envDir = path.dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 6; i++) {
  const candidate = path.join(envDir, ".env");
  if (existsSync(candidate)) {
    dotenv.config({ path: candidate });
  }
  const parent = path.dirname(envDir);
  if (parent === envDir) break;
  envDir = parent;
}

export default {
  port: 3000,
  secretKey: process.env.SECRET_KEY,
  env: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "debug",
  serviceName: process.env.SERVICE_NAME || "app-service",

  db: {
    connectionString: process.env.CONNECTION_STRING || null,
  },
};
