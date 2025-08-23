// middleware/errorHandler.js
const { mapMysqlError } = require('../utils/sqlErrorMapper');

module.exports = function errorHandler(err, _req, res, _next) {
  const mapped = mapMysqlError(err);

  // 🔊 Logging
  if (process.env.NODE_ENV !== 'test') {
    const base = `[HTTP ${mapped.status}] ${mapped.code}: ${mapped.message}`;
    if (mapped.detail) console.error(base, mapped.detail);
    else console.error(base);
  }

  // 📦 Réponse JSON (⚠️ pas de 500 en dur !)
  const payload = { error: mapped.message, code: mapped.code };
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production' && mapped.detail) payload.detail = mapped.detail;

  return res.status(mapped.status).json(payload); // <-- clé du problème
};
