function keyFromSqlMessage(sqlMessage = '') {
  const m = sqlMessage.match(/for key '([^']+)'/i);
  if (!m) return null;
  const key = m[1];
  return key.includes('.') ? key.split('.').pop() : key;
}

function mapMysqlError(err = {}) {
  const code = err.code || '';
  const errno = err.errno;
  const sqlMessage = err.sqlMessage || '';

  if (!sqlMessage && (err.status || err.code || err.message)) {
    return {
      status: err.status || 500,
      code: err.code || 'INTERNAL',
      message: err.message || 'Erreur interne',
      detail: err.detail,
      field: err.field,
    };
  }

  if (code === 'ER_DUP_ENTRY' || errno === 1062) {
    const key = keyFromSqlMessage(sqlMessage);

    let message = 'Doublon';
    switch (key) {
      case 'email':         message = 'Cet email est déjà utilisé'; break;
      case 'phone':         message = 'Ce numéro de téléphone est déjà utilisé'; break;
      case 'code':          message = 'Ce code promo existe déjà'; break;
      case 'category_name': message = 'Cette catégorie existe déjà'; break;
      case 'id_credential': message = 'Ces identifiants sont déjà liés à un utilisateur'; break;
      case 'id_product':    message = 'Ce produit a déjà une réduction'; break;
      default:              message = 'Doublon';
    }

    return {
      status: 409,
      code: 'DUPLICATE',
      message,
      field: key || undefined,
      detail: sqlMessage,
    };
  }

  if (
    code === 'ER_NO_REFERENCED_ROW_2' ||
    code === 'ER_ROW_IS_REFERENCED_2' ||
    errno === 1452 || errno === 1451 || errno === 1216 || errno === 1217
  ) {
    return {
      status: 409,
      code: 'FK_CONSTRAINT',
      message: 'Clé étrangère invalide',
      detail: sqlMessage,
    };
  }

  if (code === 'ER_BAD_NULL_ERROR' || errno === 1048) {
    return {
      status: 400,
      code: 'NOT_NULL',
      message: 'Valeur requise manquante',
      detail: sqlMessage,
    };
  }

  if (code === 'ER_DATA_TOO_LONG' || errno === 1406) {
    return {
      status: 400,
      code: 'DATA_TOO_LONG',
      message: 'Valeur trop longue',
      detail: sqlMessage,
    };
  }

  return {
    status: 500,
    code: 'INTERNAL',
    message: 'Erreur interne',
    detail: sqlMessage,
  };
}

module.exports = { mapMysqlError };
