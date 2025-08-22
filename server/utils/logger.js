const fs = require('fs');
const path = require('path');

// Load local configuration
let config = {
  logging: {
    enabled: true,
    level: 'info',
    logToFile: true,
    logFilePath: './logs/app.log',
    console: {
      enabled: true,
      colors: true,
      timestamp: true
    }
  }
};

try {
  const localConfig = require('../../local.json');
  if (localConfig.settings?.logging) {
    config.logging = localConfig.settings.logging;
  }
} catch (error) {
  console.log('Using default logging configuration');
}

// Create logs directory if it doesn't exist
const logsDir = path.dirname(config.logging.logFilePath);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple logger implementation
class SimpleLogger {
  constructor() {
    this.levels = {
      error: { priority: 0, color: '\x1b[31m', label: 'ERROR' },
      warn: { priority: 1, color: '\x1b[33m', label: 'WARN' },
      info: { priority: 2, color: '\x1b[36m', label: 'INFO' },
      debug: { priority: 3, color: '\x1b[90m', label: 'DEBUG' }
    };
    this.currentLevel = config.logging.level || 'info';
  }

  log(level, message, meta = {}) {
    const levelConfig = this.levels[level];
    if (!levelConfig) return;

    const currentLevelPriority = this.levels[this.currentLevel].priority;
    if (levelConfig.priority > currentLevelPriority) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    // Console output
    if (config.logging.console.enabled) {
      const resetColor = '\x1b[0m';
      const formattedMessage = config.logging.console.timestamp
        ? `${levelConfig.color}[${timestamp.split('T')[1].split('.')[0]}] [${levelConfig.label}]${resetColor} ${message}`
        : `${levelConfig.color}[${levelConfig.label}]${resetColor} ${message}`;
      
      console.log(formattedMessage);
      
      if (Object.keys(meta).length > 0) {
        console.log('  ', meta);
      }
    }

    // File output
    if (config.logging.enabled && config.logging.logToFile) {
      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFile(config.logging.logFilePath, logLine, (err) => {
        if (err) console.error('Failed to write to log file:', err);
      });
    }
  }

  error(message, meta) {
    this.log('error', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  debug(message, meta) {
    this.log('debug', message, meta);
  }
}

const logger = new SimpleLogger();

// Task completion notification
const notifyTaskComplete = (taskName, success = true) => {
  const message = success 
    ? `✅ Task completed: ${taskName}` 
    : `❌ Task failed: ${taskName}`;
  
  logger.info(message);
  
  // Play sound if configured
  if (config.notifications?.sound?.enabled) {
    try {
      console.log('\x07'); // System beep
    } catch (error) {
      // Silent fail
    }
  }
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    
    // Warn on slow requests
    if (duration > 1000) {
      logger.warn(`Slow request detected: ${req.method} ${req.url} took ${duration}ms`);
    }
  });
  
  next();
};

// Error logger middleware
const errorLogger = (err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  next(err);
};

module.exports = {
  logger,
  notifyTaskComplete,
  requestLogger,
  errorLogger
};