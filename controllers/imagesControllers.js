// controllers/imagesControllers.js
const ImagesServices = require('../services/imagesServices');

async function createImage(req, res, next) {
  try {
    const { image_url } = req.body || {};
    if (!image_url) {
      return next({ status: 400, code: 'VALIDATION', message: 'image_url est requis' });
    }
    const image = await ImagesServices.createImage(req.body);
    return res.status(201).json(image);
  } catch (error) {
    return next(error);
  }
}

async function getAllImages(_req, res, next) {
  try {
    const images = await ImagesServices.getAllImages();
    return res.status(200).json(images);
  } catch (error) {
    return next(error);
  }
}

async function getImageById(req, res, next) {
  try {
    const image = await ImagesServices.getImageById(req.params.id);
    if (!image) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Image non trouvée' });
    }
    return res.status(200).json(image);
  } catch (error) {
    return next(error);
  }
}

async function updateImage(req, res, next) {
  try {
    const { image_url } = req.body || {};
    if (!image_url) {
      return next({ status: 400, code: 'VALIDATION', message: 'image_url est requis' });
    }

    const image = await ImagesServices.updateImage(req.params.id, req.body);
    if (!image) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Image non trouvée' });
    }
    return res.status(200).json(image);
  } catch (error) {
    return next(error);
  }
}

async function deleteImage(req, res, next) {
  try {
    const result = await ImagesServices.deleteImage(req.params.id);
    if (!result) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Image non trouvée' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage,
};
