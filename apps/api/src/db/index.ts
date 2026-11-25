import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import config from "@/config/index.js";
import getLogger from "@/utils/logger.js";
import { relations } from "@drizzle/relations";

const moduleName = "defaultClient";

const log = getLogger(moduleName);

if (!config.db.connectionString) {
  throw new Error("Main database connection string is missing");
}

const pool = new Pool({
  connectionString: config.db.connectionString,
});

pool.on("connect", () => {
  log.info("Открыто соединение с главной БД");
});

pool.on("error", (err) => {
  log.debug(
    {
      message: err.message,
      code: err.code,
      severity: err.severity,
    },
    "Ошибка пула главной БД",
  );
});
const db = drizzle({ client: pool, relations });

export default db;
