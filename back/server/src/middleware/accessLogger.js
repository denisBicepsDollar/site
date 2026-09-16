import getLogger from "../utils/logger.js"

const moduleName = 'Middleware';

export function accessLogger(req, res, next) {
    if (req.path === '/health') return next();

    const log = getLogger(moduleName).child({
        function: 'accessLogger'
    })
    
    const startTime = new Date();

    res.on('finish', () => {
        const duration = new Date() - startTime;
        const status = res.statusCode

        const logData = {
            remote_addr: req.headers['x-real-ip'],
            method: req.method,
            path: req.path,
            status: status,
            upstream_response_time: duration,
            request_id: req.headers['x-request-id']
        };

        if (status >= 500) {
            log.error(logData, 'API Request Error');
        } else if (status >= 400) {
            log.warn(logData, 'API Request Warning');
        } else {
            log.info(logData, 'API Request Success');
        }
    });
    next();
}