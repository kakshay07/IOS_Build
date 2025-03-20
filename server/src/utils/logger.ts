import winston, { format } from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: () => {
        return new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
        });
      },
    }),
    format.json({
      space: 2,
    })
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'debug.log',
      level: 'debug',
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
logger.add(new winston.transports.Console({}));
// }
export default logger;
