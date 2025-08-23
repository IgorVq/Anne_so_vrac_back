const { p } = require('../config/bdd');

async function getAllCarts() {
    const results = await p.query('SELECT * FROM Cart');
    return results[0];
}

async function getCartByUserId(userId) {
    const results = await p.query('SELECT * FROM Cart WHERE id_user = ?', [userId]);
    return results[0];
}

async function createCart(cart) {
    const results = await p.query('INSERT INTO Cart SET ?', [cart]);
    return getCartById(results[0].insertId);
}

async function getCartInfoByCartId(cartId) {
    const results = await p.query(`select price, quantity, products.product_name, product_sizes.size, product_sizes.type, images.image_url, discounts.discount_percent from cart 
    inner join products on products.id_product = cart.id_product
    inner join product_sizes on product_sizes.id_product_size = Cart.id_product_size
    inner join product_image on product_image.id_product = products.id_product
    inner join images on images.id_image = product_image.id_image
    left join discounts on discounts.id_product = products.id_product
    where id_cart = ? and order_nb = 1;`, [cartId]);
    return results[0][0];
}

async function getCartById(id) {
    const results = await p.query('SELECT * FROM Cart WHERE id_cart = ?', [id]);
    return results[0][0];
}

async function getMyCartById(id, userId) {
    const results = await p.query('SELECT * FROM Cart WHERE id_cart = ? AND id_user = ?', [id, userId]);
    return results[0][0];
}

async function updateCart(id, cart) {
    await p.query('UPDATE Cart SET ? WHERE id_cart = ?', [cart, id]);
    return getCartById(id);
}

async function updateMyCart(id, userId, cart) {
    await p.query('UPDATE Cart SET ? WHERE id_cart = ? AND id_user = ?', [cart, id, userId]);
    return getMyCartById(id, userId);
}

async function deleteCart(id) {
    await p.query('DELETE FROM Cart WHERE id_cart = ?', [id]);
    return { message: 'Cart deleted successfully' };
}

async function deleteCartByUserId(userId) {
    await p.query('DELETE FROM Cart WHERE id_user = ?', [userId]);
    return { message: 'Cart deleted successfully for user' };
}

async function deleteMyCart(id, userId) {
    await p.query('DELETE FROM Cart WHERE id_cart = ? AND id_user = ?', [id, userId]);
    return { message: 'My cart deleted successfully' };
}

module.exports = {
    getAllCarts,
    createCart,
    getCartById,
    getMyCartById,
    updateCart,
    updateMyCart,
    deleteCart,
    getCartByUserId,
    getCartInfoByCartId,
    deleteCartByUserId,
    deleteMyCart
};