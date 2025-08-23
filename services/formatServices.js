const { p } = require('../config/bdd');

async function getAllFormats() {
    const results = await p.query('SELECT * FROM Format');
    return results[0];
}

async function createFormat(format) {
    const results = await p.query('INSERT INTO Format SET ?', [format]);
    return format;
}

async function getProductSizeByProductId(productId) {
    const results = await p.query(
        'SELECT ps.id_product_size, ps.size, ps.type, f.default_selected FROM Product_sizes ps JOIN Format f ON ps.id_product_size = f.id_product_size WHERE f.id_product = ? AND ps.active = 1 order by ps.size',
        [productId]
    );
    return results[0];
}

async function getFormatByProductId(id) {
    const results = await p.query(
        'SELECT f.*, ps.size, ps.type FROM Format f JOIN Product_sizes ps ON f.id_product_size = ps.id_product_size WHERE f.id_product = ? AND ps.active = 1',
        [id]
    );
    return results[0];
}

async function getFormatByProductSizeId(id) {
    const results = await p.query(
        'SELECT f.*, p.product_name FROM Format f JOIN Products p ON f.id_product = p.id_product WHERE f.id_product_size = ?',
        [id]
    );
    return results[0];
}

async function deleteFormat(productId, productSizeId) {
    const result = await p.query(
        'DELETE FROM Format WHERE id_product = ? AND id_product_size = ?',
        [productId, productSizeId]
    );
    return result[0].affectedRows > 0;
}

module.exports = {
    getAllFormats,
    createFormat,
    getFormatByProductId,
    getFormatByProductSizeId,
    deleteFormat,
    getProductSizeByProductId
};