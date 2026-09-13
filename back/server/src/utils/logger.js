import pino from 'pino'
import config from '../config/index.js'
import {loggerStorage} from "../middleware/requestContext.js";


const isDev = config.env === 'development';

const mainLogger = pino({

    level: config.logLevel,

    base: {
        service: config.serviceName
    },

    timestamp: () => `,"time": "${new Date().toISOString()}"`,

    serializers: {
        err: pino.stdSerializers.err,
    },

    redact: {
        paths: ['req.headers.cookie', 'password', '*.password'],
        censor: '[REDACTED]'
    },

    transport: isDev && {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat: '{if module}{module} {end}{if function}{function} {end} {msg}'
        }
    }
})
export default function getLogger(module){
    const context = loggerStorage.getStore()

    const modLog = context?.log ?? mainLogger

    if (module) return modLog.child({module})

    return modLog
}