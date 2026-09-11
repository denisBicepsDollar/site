import {runWorker} from "../worker/worker.js";
import logger from "../utils/logger.js";

const log = logger.child({
    module: 'worker'
})
log.info("Воркер запущен");
runWorker();