const { p } = require('../config/bdd');

async function getAllInfoMags() {
    const results = await p.query('SELECT * FROM info_mag');
    return results[0];
}

async function createInfoMag(infoMag) {
    const results = await p.query('INSERT INTO info_mag SET ?', [infoMag]);
    return getInfoMagById(results[0].insertId);
}

async function getInfoMagById(id) {
    const results = await p.query('SELECT * FROM info_mag WHERE id_info_mag = ?', [id]);
    return results[0][0];
}

async function getTopBannerMessages() {
    const results = await p.query('SELECT * FROM info_mag where display = "topbanner"');
    return results[0];
}

async function getTopbarMessages() {
    const results = await p.query('SELECT * FROM info_mag WHERE display = "topbar"');
    return results[0];
}

async function updateInfoMag(id, infoMag) {
    await p.query('UPDATE info_mag SET ? WHERE id_info_mag = ?', [infoMag, id]);
    return getInfoMagById(id);
}

async function deleteInfoMag(id) {
    await p.query('DELETE FROM info_mag WHERE id_info_mag = ?', [id]);
    return { message: 'InfoMag deleted successfully' };
}

module.exports = {
    getAllInfoMags,
    createInfoMag,
    getInfoMagById,
    updateInfoMag,
    deleteInfoMag,
    getTopBannerMessages,
    getTopbarMessages
};