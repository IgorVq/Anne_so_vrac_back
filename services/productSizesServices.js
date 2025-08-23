const { p } = require('../config/bdd');

async function getAllProductSizes() {
    const results = await p.query('SELECT * FROM product_sizes');
    return results[0];
}

async function createProductSize(productSize) {
    const results = await p.query('INSERT INTO product_sizes SET ?', [productSize]);
    return getProductSizeById(results[0].insertId);
}

async function getProductSizeById(id) {
    const results = await p.query('SELECT * FROM product_sizes WHERE id_product_size = ?', [id]);
    return results[0][0];
}

async function updateProductSize(id, productSize) {
    await p.query('UPDATE product_sizes SET ? WHERE id_product_size = ?', [productSize, id]);
    return getProductSizeById(id);
}

async function deleteProductSize(id) {
    await p.query('DELETE FROM product_sizes WHERE id_product_size = ?', [id]);
    return { message: 'Product size deleted successfully' };
}

module.exports = {
    getAllProductSizes,
    createProductSize,
    getProductSizeById,
    updateProductSize,
    deleteProductSize
};