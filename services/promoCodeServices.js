const { p } = require('../config/bdd');

async function getAllPromoCodes() {
    const results = await p.query('SELECT * FROM promo_code');
    return results[0];
}

async function createPromoCode(promoCode) {
    const results = await p.query('INSERT INTO promo_code SET ?', [promoCode]);
    return getPromoCodeById(results[0].insertId);
}

async function getPromoCodeById(id) {
    const results = await p.query('SELECT * FROM promo_code WHERE id_promo_code = ?', [id]);
    return results[0][0];
}

async function getPromoCodeByCode(code) {
    const results = await p.query('SELECT * FROM promo_code WHERE code = ?', [code]);
    return results[0][0];
}

async function checkPromoCodeIsValid(code, id_user) {
    const results = await p.query(
  `SELECT p.*
   FROM promo_code p
   WHERE p.code = ?
     AND p.is_active = 1
     AND p.valid_from <= NOW()
     AND p.valid_to   >= NOW()
     AND NOT EXISTS (
       SELECT 1
       FROM reservation r
       WHERE r.id_promo_code = p.id_promo_code
         AND r.id_user = ?
         AND r.status IN ('withdrawn','available','confirmed')
     )`,
  [code, id_user]
);
    return results[0][0];
}

async function updatePromoCode(id, promoCode) {
    await p.query('UPDATE promo_code SET ? WHERE id_promo_code = ?', [promoCode, id]);
    return getPromoCodeById(id);
}

async function deletePromoCode(id) {
    await p.query('DELETE FROM promo_code WHERE id_promo_code = ?', [id]);
    return { message: 'Promo code deleted successfully' };
}

module.exports = {
    getAllPromoCodes,
    createPromoCode,
    getPromoCodeById,
    updatePromoCode,
    deletePromoCode,
    getPromoCodeByCode,
    checkPromoCodeIsValid
};