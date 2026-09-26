const winston = require('winston');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Format default untuk file (JSON terstruktur)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json()
);

// Format khusus console berdasarkan environment
const isDevelopment = process.env.NODE_ENV === 'development';

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  isDevelopment ? winston.format.colorize({ all: true }) : winston.format.uncolorize(),
  winston.format.printf(
    (info) => `[${info.timestamp}] [${info.level}] ${info.message}`
  )
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: fileFormat,
  }),
  new winston.transports.File({ 
    filename: 'logs/combined.log',
    format: fileFormat,
  }),
];

const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  levels,
  transports,
});

module.exports = logger;