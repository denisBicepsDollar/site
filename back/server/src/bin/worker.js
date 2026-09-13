import * as reportService from '../services/Reports/reportService.js';
import getLogger from "../utils/logger.js";
import {initCrashHandler} from "../utils/terminate.js";

const log = getLogger().child({
    module: 'worker'
})
initCrashHandler()

export async function runWorker(pollMs = 1000) {
    log.info({pollMs}, 'runWorker');

    while (true) {
        try {
            const did = await reportService.processNext();
            // Если задач не было — ждём перед следующим поллингом
            if (!did) await new Promise(resolve => setTimeout(resolve, pollMs));
        } catch (err) {
            await new Promise(resolve => setTimeout(resolve, pollMs));
            throw err;
        }
    }
}
runWorker();