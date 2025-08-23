const { p } = require('../config/bdd');

async function getAllImages() {
    const results = await p.query('SELECT * FROM Images');
    return results[0];
}

async function createImage(image) {
    try {
        const [result] = await p.query('INSERT INTO Images (image_url) VALUES (?)', 
            [image.image_url]);
        return getImageById(result.insertId);
    } catch (error) {
        throw error;
    }
}

async function getImageById(id) {
    const [results] = await p.query('SELECT * FROM Images WHERE id_image = ?', [id]);
    return results[0];
}

async function updateImage(id, image) {
    const [result] = await p.query('UPDATE Images SET image_url = ? WHERE id_image = ?', 
        [image.image_url, id]);
    if (result.affectedRows === 0) {
        return null;
    }
    return getImageById(id);
}

async function deleteImage(id) {
    const [result] = await p.query('DELETE FROM Images WHERE id_image = ?', [id]);
    return result.affectedRows > 0;
}

module.exports = {
    getAllImages,
    createImage,
    getImageById,
    updateImage,
    deleteImage
};