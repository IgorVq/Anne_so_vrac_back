const { p } = require('../config/bdd');

async function getAllReservationProducts() {
    const results = await p.query('SELECT * FROM reservation_products');
    return results[0];
}

async function createReservationProduct(reservationProduct) {
    const results = await p.query('INSERT INTO reservation_products SET ?', [reservationProduct]);
    return getReservationProductById(reservationProduct.id_reservation, reservationProduct.id_product, reservationProduct.id_product_size);
}

async function getReservationProductById(id_reservation, id_product, id_product_size) {
    const results = await p.query(
        'SELECT * FROM reservation_products WHERE id_reservation = ? AND id_product = ? AND id_product_size = ?',
        [id_reservation, id_product, id_product_size]
    );
    return results[0][0];
}

async function getAllReservationProductsByReservationId(id_reservation) {
    const results = await p.query(`
        SELECT products.price, reservation_products.quantity, products.product_name, product_sizes.size, product_sizes.type, images.image_url, discounts.discount_percent, 
               reservation_products.id_product, reservation_products.id_product_size
        FROM reservation_products 
        INNER JOIN products ON products.id_product = reservation_products.id_product
        INNER JOIN product_sizes ON product_sizes.id_product_size = reservation_products.id_product_size
        INNER JOIN product_image ON product_image.id_product = products.id_product
        INNER JOIN images ON images.id_image = product_image.id_image
        left join discounts on discounts.id_product = products.id_product
        WHERE id_reservation = ? AND order_nb = 1
    `, [id_reservation]);
    return results[0];
}

async function updateReservationProduct(id_reservation, id_product, id_product_size, reservationProduct) {
    await p.query(
        'UPDATE reservation_products SET ? WHERE id_reservation = ? AND id_product = ? AND id_product_size = ?',
        [reservationProduct, id_reservation, id_product, id_product_size]
    );
    return getReservationProductById(id_reservation, id_product, id_product_size);
}

async function deleteReservationProduct(id_reservation, id_product, id_product_size) {
    await p.query(
        'DELETE FROM reservation_products WHERE id_reservation = ? AND id_product = ? AND id_product_size = ?',
        [id_reservation, id_product, id_product_size]
    );
    return { message: 'Reservation product deleted successfully' };
}

module.exports = {
    getAllReservationProducts,
    createReservationProduct,
    getReservationProductById,
    updateReservationProduct,
    deleteReservationProduct,
    getAllReservationProductsByReservationId
};