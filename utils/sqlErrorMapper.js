// utils/sqlErrorMapper.js (CommonJS)
function mapMysqlError(err = {}) {
  const errno = err.errno;
  const code = err.code;

  // Helpers
  const detail = err.sqlMessage || err.message;

  // Mapping ciblé MySQL -> HTTP
  switch (errno) {
    case 1452: // ER_NO_REFERENCED_ROW_2
      return { status: 409, code: 'FK_CONSTRAINT', message: 'Clé étrangère invalide', detail };
    case 1451: // ER_ROW_IS_REFERENCED_2
      return { status: 409, code: 'FK_CONSTRAINT', message: 'Contrainte de clé étrangère', detail };
    case 1048: // ER_BAD_NULL_ERROR
      return { status: 400, code: 'NOT_NULL', message: 'Valeur requise manquante', detail };
    case 1062: { // ER_DUP_ENTRY
      // Essaie d’extraire la colonne clé unique depuis le message
      let col = '';
      const m = /for key '([^']+)'/i.exec(detail || '');
      if (m) col = m[1];
      return { status: 409, code: 'DUPLICATE', message: 'Doublon', detail: col ? `${detail} (clé: ${col})` : detail };
    }
    case 1366: // ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      return { status: 400, code: 'INVALID_VALUE', message: 'Valeur invalide', detail };
    case 1406: // ER_DATA_TOO_LONG
      return { status: 400, code: 'DATA_TOO_LONG', message: 'Valeur trop longue', detail };
    case 1364: // ER_NO_DEFAULT_FOR_FIELD
      return { status: 400, code: 'MISSING_DEFAULT', message: 'Valeur manquante', detail };
    default:
      // Si on reconnait un code MySQL sans errno
      if (code === 'ER_NO_REFERENCED_ROW_2') return { status: 409, code: 'FK_CONSTRAINT', message: 'Clé étrangère invalide', detail };
      if (code === 'ER_BAD_NULL_ERROR')      return { status: 400, code: 'NOT_NULL',       message: 'Valeur requise manquante', detail };
      if (code === 'ER_DUP_ENTRY')           return { status: 409, code: 'DUPLICATE',     message: 'Doublon', detail };
      // Par défaut
      return { status: 500, code: 'INTERNAL_ERROR', message: 'Erreur interne', detail: process.env.NODE_ENV === 'test' ? detail : undefined };
  }
}

function sendMappedError(res, err) {
  const mapped = mapMysqlError(err);
  const payload = { error: mapped.message, code: mapped.code };
  if (mapped.detail && process.env.NODE_ENV !== 'production') payload.detail = mapped.detail;
  return res.status(mapped.status).json(payload);
}

module.exports = { mapMysqlError, sendMappedError };
