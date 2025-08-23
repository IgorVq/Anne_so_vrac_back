// controllers/productImageControllers.js
const ProductsImageServices = require('../services/productImageServices');

async function createProductImage(req, res, next) {
  try {
    const { id_product, id_image } = req.body || {};
    if (!id_product || !id_image) {
      return next({
        status: 400,
        code: 'VALIDATION',
        message: 'id_product et id_image sont requis',
      });
    }
    const productImage = await ProductsImageServices.createProductImage(req.body);
    return res.status(201).json(productImage);
  } catch (error) {
    return next(error);
  }
}

async function getAllProductImages(_req, res, next) {
  try {
    const productImages = await ProductsImageServices.getAllProductImages();
    return res.status(200).json(productImages);
  } catch (error) {
    return next(error);
  }
}

async function getProductImagesByProductId(req, res, next) {
  try {
    const { id } = req.params || {};
    if (!id) {
      return next({ status: 400, code: 'VALIDATION', message: 'ID du produit requis' });
    }
    const productImages = await ProductsImageServices.getProductImageById(id);
    if (!productImages || productImages.length === 0) {
      return next({ status: 404, code: 'NOT_FOUND', message: 'Aucune image trouvée pour ce produit' });
    }
    return res.status(200).json(productImages);
  } catch (error) {
    return next(error);
  }
}

async function deleteProductImage(req, res, next) {
  try {
    const { productId, imageId } = req.params || {};
    if (!productId || !imageId) {
      return next({
        status: 400,
        code: 'VALIDATION',
        message: "ID du produit et ID de l'image requis",
      });
    }

    const result = await ProductsImageServices.deleteProductImage(productId, imageId);
    if (!result) {
      return next({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Association produit-image non trouvée',
      });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProductImage,
  getAllProductImages,
  getProductImagesByProductId,
  deleteProductImage,
};
