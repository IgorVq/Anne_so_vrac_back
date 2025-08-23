const { p } = require('../config/bdd');

async function getAllDiscounts() {
    const results = await p.query('SELECT * FROM Discounts');
    return results[0];
}

async function createDiscount(discount) {
    const results = await p.query('INSERT INTO Discounts SET ?', [discount]);
    return getDiscountById(results[0].insertId);
}

async function getDiscountById(id) {
    const results = await p.query('SELECT * FROM Discounts WHERE id_discount = ?', [id]);
    return results[0][0];
}

async function updateDiscount(id, discount) {
    await p.query('UPDATE Discounts SET ? WHERE id_discount = ?', [discount, id]);
    return getDiscountById(id);
}

async function deleteDiscount(id) {
    const result = await p.query('DELETE FROM Discounts WHERE id_discount = ?', [id]);
    return result[0].affectedRows > 0;
}

async function getDiscountsByProduct(productId) {
    const results = await p.query('SELECT * FROM discounts WHERE id_product = ?', [productId]);
    return results[0];
}

module.exports = {
    getAllDiscounts,
    createDiscount,
    getDiscountById,
    updateDiscount,
    deleteDiscount,
    getDiscountsByProduct
};