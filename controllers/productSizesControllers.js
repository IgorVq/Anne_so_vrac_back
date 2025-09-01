const ProductSizesServices = require('../services/productSizesServices');

async function createProductSize(req, res, next) {
  try {
    const productSize = await ProductSizesServices.createProductSize(req.body);
    return res.status(201).json(productSize);
  } catch (error) {
    return next(error);
  }
}

async function getAllProductSizes(_req, res, next) {
  try {
    const productSizes = await ProductSizesServices.getAllProductSizes();
    return res.status(200).json(productSizes);
  } catch (error) {
    return next(error);
  }
}

async function getProductSizeById(req, res, next) {
  try {
    const productSize = await ProductSizesServices.getProductSizeById(req.params.id);
    if (!productSize) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Taille de produit non trouvée' });
    }
    return res.status(200).json(productSize);
  } catch (error) {
    return next(error);
  }
}

async function updateProductSize(req, res, next) {
  try {
    const productSize = await ProductSizesServices.updateProductSize(req.params.id, req.body);
    if (!productSize) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Taille de produit non trouvée' });
    }
    return res.status(200).json(productSize);
  } catch (error) {
    return next(error);
  }
}

async function deleteProductSize(req, res, next) {
  try {
    const result = await ProductSizesServices.deleteProductSize(req.params.id);
    if (!result) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Taille de produit non trouvée' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProductSize,
  getAllProductSizes,
  getProductSizeById,
  updateProductSize,
  deleteProductSize,
};
