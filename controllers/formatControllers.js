// controllers/formatControllers.js
const FormatServices = require('../services/formatServices');

async function createFormat(req, res, next) {
  try {
    const format = await FormatServices.createFormat(req.body);
    return res.status(201).json(format);
  } catch (error) {
    return next(error);
  }
}

async function getAllFormats(_req, res, next) {
  try {
    const formats = await FormatServices.getAllFormats();
    return res.status(200).json(formats);
  } catch (error) {
    return next(error);
  }
}

async function getFormatById(req, res, next) {
  try {
    const format = await FormatServices.getFormatById(req.params.id);
    if (!format) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Format non trouvé' });
    }
    return res.status(200).json(format);
  } catch (error) {
    return next(error);
  }
}

async function getProductSizeByProductId(req, res, next) {
  try {
    const productSizes = await FormatServices.getProductSizeByProductId(req.params.id);
    if (!productSizes || productSizes.length === 0) {
      return next({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Aucune taille de produit trouvée pour ce produit',
      });
    }
    return res.status(200).json(productSizes);
  } catch (error) {
    return next(error);
  }
}

async function updateFormat(req, res, next) {
  try {
    const format = await FormatServices.updateFormat(req.params.id, req.body);
    if (!format) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Format non trouvé' });
    }
    return res.status(200).json(format);
  } catch (error) {
    return next(error);
  }
}

async function getFormatByProductId(req, res, next) {
  try {
    const formats = await FormatServices.getFormatByProductId(req.params.id);
    return res.status(200).json(formats);
  } catch (error) {
    return next(error);
  }
}

async function getFormatByProductSizeId(req, res, next) {
  try {
    const formats = await FormatServices.getFormatByProductSizeId(req.params.id);
    return res.status(200).json(formats);
  } catch (error) {
    return next(error);
  }
}

async function deleteFormat(req, res, next) {
  try {
    const { productId, productSizeId } = req.params;
    if (!productId || !productSizeId) {
      return next({
        status: 400,
        code: 'VALIDATION',
        message: 'productId et productSizeId sont requis',
      });
    }

    const result = await FormatServices.deleteFormat(productId, productSizeId);
    if (!result) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Format non trouvé' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createFormat,
  getAllFormats,
  getFormatById,
  updateFormat,
  getFormatByProductId,
  getFormatByProductSizeId,
  deleteFormat,
  getProductSizeByProductId,
};
