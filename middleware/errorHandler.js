// middleware/errorHandler.js
const { mapMysqlError } = require('../utils/sqlErrorMapper');

module.exports = function errorHandler(err, _req, res, _next) {
  const mapped = mapMysqlError(err);
  const env = process.env.NODE_ENV;

  // 🔊 Logging
  if (env === 'test') {
    // En test : log court (utile pour Jest sans bruit)
    console.log(mapped.message);
  } else {
    const base = `[HTTP ${mapped.status}] ${mapped.code}: ${mapped.message}`;
    if (mapped.detail) console.error(base, mapped.detail);
    else console.error(base);
  }

  // 📦 Réponse JSON — compat front (toast(error) OU toast(message))
  const payload = {
    code: mapped.code,
    error: mapped.message,
    message: mapped.message,
  };
  if (mapped.field) payload.field = mapped.field;
  if (env !== 'test' && env !== 'production' && mapped.detail) {
    payload.detail = mapped.detail; // détail seulement en dev
  }

  return res.status(mapped.status).json(payload);
};
