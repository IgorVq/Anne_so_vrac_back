const uploadService = require('../services/uploadServices');
const path = require('path');

const uploadFile = (req, res, next) => {
  try {
    const fileName = uploadService.saveUpload(req.file);
    return res.status(200).json({ message: 'Fichier reçu', path: `/upload/${fileName}` });
  } catch (error) {
    return next(error);
  }
};

const getFile = (req, res, _next) => {
  const name = req.params.name;
  return res.sendFile(path.join(__dirname, '../uploads/', name));
};

const deleteFile = (req, res, next) => {
  try {
    uploadService.deleteUpload(req.params.name);
    return res.status(200).json({ message: 'Fichier supprimé' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  uploadFile,
  getFile,
  deleteFile,
};
