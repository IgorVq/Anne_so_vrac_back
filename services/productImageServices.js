const { p } = require('../config/bdd');

async function getAllProductImages() {
    const results = await p.query(`
        SELECT pi.*, p.product_name, i.image_url 
        FROM Product_image pi
        JOIN Products p ON pi.id_product = p.id_product
        JOIN Images i ON pi.id_image = i.id_image
    `);
    return results[0];
}

async function createProductImage(productImage) {
    try {
        await p.query('INSERT INTO Product_image SET ?', [productImage]);
        return productImage;
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error('Cette association produit-image existe déjà');
        }
        throw error;
    }
}

async function getProductImageById(id) {
    const results = await p.query(`
        SELECT i.image_url, i.id_image
        FROM Product_image pi
        JOIN Products p ON pi.id_product = p.id_product
        JOIN Images i ON pi.id_image = i.id_image
        WHERE pi.id_product = ?
        ORDER BY pi.order_nb
    `, [id]);
    return results[0];
}

async function getProductImagesByProductId(productId) {
    const results = await p.query(`
        SELECT pi.*, p.product_name, i.image_url 
        FROM Product_image pi
        JOIN Products p ON pi.id_product = p.id_product
        JOIN Images i ON pi.id_image = i.id_image
        WHERE pi.id_product = ?
    `, [productId]);
    return results[0];
}

async function getProductImagesByImageId(imageId) {
    const results = await p.query(`
        SELECT pi.*, p.product_name, i.image_url 
        FROM Product_image pi
        JOIN Products p ON pi.id_product = p.id_product
        JOIN Images i ON pi.id_image = i.id_image
        WHERE pi.id_image = ?
    `, [imageId]);
    return results[0];
}

async function deleteProductImage(productId, imageId) {
    try {
        const result = await p.query(
            'DELETE FROM Product_image WHERE id_product = ? AND id_image = ?',
            [productId, imageId]
        );
        return result[0].affectedRows > 0;
    } catch (error) {
        throw new Error('Erreur lors de la suppression de l\'association produit-image');
    }
}

module.exports = {
    getAllProductImages,
    createProductImage,
    getProductImageById,
    getProductImagesByProductId,
    getProductImagesByImageId,
    deleteProductImage,
};