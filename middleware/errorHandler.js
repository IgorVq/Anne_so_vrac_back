
const { mapMysqlError } = require('../utils/sqlErrorMapper');

module.exports = function errorHandler(err, _req, res, _next) {
  const mapped = mapMysqlError(err);
  const env = process.env.NODE_ENV;

  if (env === 'test') {
    console.log(mapped.message);
  } else {
    const base = `[HTTP ${mapped.status}] ${mapped.code}: ${mapped.message}`;
    if (mapped.detail) console.error(base, mapped.detail);
    else console.error(base);
  }

  const payload = {
    code: mapped.code,
    error: mapped.message,
    message: mapped.message,
  };
  if (mapped.field) payload.field = mapped.field;
  if (env !== 'test' && env !== 'production' && mapped.detail) {
    payload.detail = mapped.detail;
  }

  return res.status(mapped.status).json(payload);
};
