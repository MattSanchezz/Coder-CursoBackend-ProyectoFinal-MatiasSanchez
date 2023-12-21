import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logLevels = {
  DEBUG: 'debug',
  HTTP: 'http',
  INFO: 'info',
  WARNING: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};

const logsDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const errorTransport = new winston.transports.File({
  filename: path.join(logsDir, 'errors.log'),
  level: logLevels.ERROR,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

const consoleTransport = new winston.transports.Console({
  level: process.env.LOG_LEVEL || logLevels.DEBUG,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
});

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  transports: [errorTransport, consoleTransport],
});

function log(level, message) {
  logger.log(level, message);
}

export { log, logLevels };


