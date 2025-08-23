const uploadService = require('../services/uploadServices');
const path = require('path');

const uploadFile = (req, res) => {
    try {
        const fileName = uploadService.saveUpload(req.file);
        res.status(200).json({ message: 'Fichier reçu', path: `/upload/${fileName}` });
    } catch (error) {
        return next(error);
    }
};

const getFile = (req, res) => {
    const name = req.params.name;
    res.sendFile(path.join(__dirname, '../uploads/', name));
};

const deleteFile = (req, res) => {
    try {
        uploadService.deleteUpload(req.params.name);
        res.status(200).json({ message: 'Fichier supprimé' });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    uploadFile,
    getFile,
    deleteFile,
};
