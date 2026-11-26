import dotenv from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

dotenv.config();
const rootEnv = path.resolve(process.cwd(), "../../.env");
if (existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}

export default defineConfig({
  out: "./drizzle",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.CONNECTION_STRING!,
  },
});
