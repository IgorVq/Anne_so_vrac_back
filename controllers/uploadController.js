const uploadService = require('../services/uploadServices');
const path = require('path');

const uploadFile = (req, res) => {
    try {
        const fileName = uploadService.saveUpload(req.file);
        res.status(200).json({ message: 'Fichier reçu', path: `/upload/${fileName}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
        res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
    }
};

module.exports = {
    uploadFile,
    getFile,
    deleteFile,
};
