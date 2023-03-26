const morgan = require('morgan');
const json = require('morgan-json');
const logger = require('./logger');

const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time ms',
});

const httpLogger = morgan(format, {
  stream: {
    write: (message) => {
      const { method, url, status, contentLength, responseTime } =
        JSON.parse(message);

      logger.info('Http Access Log', {
        timeStamp: new Date().toString(),
        method,
        url,
        status: Number(status),
        contentLength,
        responseTime,
      });
    },
  },
});

module.exports = httpLogger;
