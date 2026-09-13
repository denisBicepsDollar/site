import getLogger from './logger.js'
import config from '../config/index.js'

const moduleName = 'system';

const log = getLogger(moduleName);

export function initCrashHandler({httpServer = null} = {}){

    process.on('uncaughtException', (err) => {
        log.fatal({
            errorType: err.name || 'uncaughtException',
            message: err.message,
            stack: err.stack,
        }, 'CRITICAL: Process crashed due to an uncaught exception')
        setTimeout(()=> {
            process.exit(1);
        }, 500)
    })

    process.on('unhandledRejection', (reason) => {
        log.error({
            errorType: 'unhandledRejection',
            message: reason instanceof Error ? reason.message : String(reason),
            stack: reason instanceof Error ? reason.stack : String(reason),
        }, 'CRITICAL: Unhandled promise rejection')
        setTimeout(()=> {
            process.exit(1);
        }, 500)
    })

    process.on('SIGTERM', async () => {
        log.info('Received SIGTERM signal. Initiating graceful shutdown...')

        if (config.serviceName === 'api') {
            const server = httpServer?.instance
            log.info('HTTP server closing...');
            await new Promise((resolve) => server.close(resolve));
            log.info('HTTP server stopped cleanly');
        }

        if (config.serviceName === 'worker') {
            log.info('Worker tasks stopping...')

            setTimeout(() => {
                log.info('Worker stopped cleanly');
                process.exit(0)
            } , 500);
        }
        else {
                process.exit(0);
        }
    })
}