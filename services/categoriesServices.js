const { p } = require('../config/bdd');

async function getAllCategories() {
    const results = await p.query('SELECT * FROM categories');
    return results[0];
}

async function getAvailableCategories() {
    const results = await p.query('SELECT * FROM categories WHERE visible = 1');
    return results[0];
}

async function createCategory(category) {
    const results = await p.query('INSERT INTO categories SET ?', [category]);
    return getCategoryById(results[0].insertId);
}

async function getCategoryById(id) {
    const results = await p.query('SELECT * FROM categories WHERE id_category = ?', [id]);
    return results[0][0];
}

async function updateCategory(id, category) {
    await p.query('UPDATE categories SET ? WHERE id_category = ?', [category, id]);
    return getCategoryById(id);
}

async function deleteCategory(id) {
    await p.query('DELETE FROM categories WHERE id_category = ?', [id]);
    return { message: 'Category deleted successfully' };
}

module.exports = {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAvailableCategories
};