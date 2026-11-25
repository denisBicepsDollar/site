import { initCrashHandler } from "@/utils/terminate";
import config from "@/config/index";
import getLogger from "@/utils/logger";
import { createApp } from "./app";

const server = { instance: null as any };
initCrashHandler({ httpServer: server });

const moduleName = "server";
const log = getLogger(moduleName);

export function startServer() {
  const app = createApp();
  const port = config.port;
  const env = config.env;

  const runningServer = app.listen(port, () => {
    log.info({ port, env }, "started");
  });

  server.instance = runningServer;

  return runningServer;
}

startServer();
