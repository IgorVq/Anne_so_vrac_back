const { p } = require('../config/bdd');

async function getAllUserPromoCodes() {
    const results = await p.query('SELECT * FROM user_promo_code');
    return results[0];
}
async function createUserPromoCode(userPromoCode) {
    const results = await p.query('INSERT INTO user_promo_code SET ?', [userPromoCode]);
    return getUserPromoCodeById(results[0].insertId);
}
async function getUserPromoCodeById(id) {
    const results = await p.query('SELECT * FROM user_promo_code WHERE id_promo_code = ?', [id]);
    return results[0][0];
}

async function checkPromoCodeUsed(code, userId) {
    console.log('Checking promo code usage for user:', userId, 'with code:', code);
    // const results = await p.query('SELECT * FROM user_promo_code inner join promo_code on user_promo_code.id_promo_code = promo_code.id_promo_code inner join reservation on promo_code.id_promo_code = reservation.id_promo_code WHERE (promo_code.code = ? AND user_promo_code.id_user = ?) or (reservation.id_user = ? and promo_code.code = ?)', [code, userId, userId, code]);
    const results = await p.query('SELECT * FROM promo_code inner join reservation on promo_code.id_promo_code = reservation.id_promo_code WHERE promo_code.code = ? AND reservation.id_user = ?', [code, userId]);
    console.log('Results from checkPromoCodeUsed:', results);
    return results[0];
}

async function updateUserPromoCode(id, userPromoCode) {
    await p.query('UPDATE user_promo_code SET ? WHERE id_promo_code = ?', [userPromoCode, id]);
    return getUserPromoCodeById(id);
}
async function deleteUserPromoCode(id) {
    await p.query('DELETE FROM user_promo_code WHERE id_promo_code = ?', [id]);
    return { message: 'User promo code deleted successfully' };
}

module.exports = {
    getAllUserPromoCodes,
    createUserPromoCode,
    checkPromoCodeUsed,
    getUserPromoCodeById,
    updateUserPromoCode,
    deleteUserPromoCode
};